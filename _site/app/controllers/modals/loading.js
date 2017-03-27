import Ember from 'ember';
const { observer, run } = Ember;

export default Ember.Controller.extend({
  initProgressMonitor: observer('model', function() {
    if (!this.get('model')) {
      return;
    }

    run.once(this, this.updateProgress);
  }),

  updateProgress() {
    let allPromises = [];

    this.get('model').forEach((arr) => {
      arr.forEach((promise) => allPromises.push(promise));
    });

    const total = allPromises.length;
    let complete = 0;

    allPromises.forEach((p) => p.then(() => {
      complete++;
      this.set('progress', parseInt(complete / total * 100, 10));

      if (this.get('progress') === 100) {
        run.next(() => {
          Ember.$('.modal').modal('hide');
          Ember.$('body').addClass('audio-loaded');
        });
      }
    }));
  },

  actions: {
    close() {
      this.send('removeModal');
    }
  }
});
