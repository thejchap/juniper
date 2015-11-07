import Ember from 'ember';
const { run, on } = Ember;

export default Ember.Component.extend({
  show: on('didInsertElement', function() {
    run.next(() => {
      this.$('.modal').modal().on('hidden.bs.modal', () => {
        this.sendAction('close');
      }).on('hide.bs.modal', function() {
        Ember.$(this).addClass('out');
      });
    });
  }),

  actions: {
    ok() {
      this.$('.modal').modal('hide');
    }
  }
});
