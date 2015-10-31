import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('stem');
  },

  actions: {
    toggleStem(stem) {
      stem.toggleProperty('on');
    }
  }
});
