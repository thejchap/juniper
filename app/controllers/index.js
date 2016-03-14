import Ember from 'ember';
import config from 'juniper/config/environment';
const { observer, computed, run } = Ember;

export default Ember.Controller.extend({
  queryParams: {
    stemData: 's',
    ids: 'i'
  },

  fbAppId: config.APP.FB_APP_ID,

  ids: '8',

  stemData: null,

  transport: Ember.inject.controller(),

  onStems: computed.filterBy('model', 'on', true).readOnly(),

  redirectOnToggles: observer('model.@each.isReversed', 'model.@each.on', function() {
    run.next(() => this.send('updateUrl'));
  })
});
