import Ember from 'ember';
const { run } = Ember;

export default Ember.Component.extend({
  show: function() {
    run.next(() => {
      this.$('.modal').modal().on('hidden.bs.modal', function() {
        this.sendAction('close');
      }.bind(this));
    });
  }.on('didInsertElement'),

  actions: {
    ok() {
      this.sendAction('ok', () => {
        this.$('.modal').modal('hide');
      });
    }
  }
});
