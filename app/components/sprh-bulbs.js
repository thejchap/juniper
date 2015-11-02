import Ember from 'ember';

export default Ember.Component.extend({
  action: 'toggleStem',

  actions: {
    toggleStem(stem) {
      this.sendAction('action', stem);
    }
  }
});
