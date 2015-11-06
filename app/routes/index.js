import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    const loadStems = this.store.findAll('stem');

    return loadStems.then((stems) => {
      const loadAudio = Promise.all(stems.invoke('loadAudio'));

      return loadAudio.then(() => stems);
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    const transport = controller.get('transport');

    transport.set('stems', model);
    transport.send('play');
  },

  actions: {
    toggleStem(stem) {
      stem.toggleProperty('on');
    }
  }
});
