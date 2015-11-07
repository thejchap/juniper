import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: {
    mixHex: 'm'
  },

  mixHex: null,

  transport: Ember.inject.controller(),

  actions: {
    togglePlaying() {
      this.get('transport').send('togglePlaying');
    }
  }
});
