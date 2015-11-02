import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: {
    mixHex: 'm'
  },

  mixHex: '20010000',

  transport: Ember.inject.controller()
});
