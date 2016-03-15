import Ember from 'ember';
import config from 'juniper/config/environment';
const { observer, computed, run, inject } = Ember;

export default Ember.Controller.extend({
  queryParams: {
    stemData: 's',
    ids: 'i'
  },

  ids: '8',

  stemData: null,

  transport: inject.controller(),

  metrics: inject.service(),

  preorderDigitalLink: config.APP.LINKS.PREORDER.ITUNES,

  preorderVinylLink: config.APP.LINKS.PREORDER.VINYL,

  onStems: computed.filterBy('model', 'on', true).readOnly(),

  redirectOnToggles: observer('model.@each.isReversed', 'model.@each.on', function() {
    run.next(() => this.send('updateUrl'));
  })
});
