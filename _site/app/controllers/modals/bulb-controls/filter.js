import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    close() {
      this.send('removeModal');
    },

    filterUpdated() {
      this.send('updateUrl');
    }
  }
});
