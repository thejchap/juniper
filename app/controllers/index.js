import Ember from 'ember';
import config from 'juniper/config/environment';
const { observer, computed, run, inject } = Ember;

export default Ember.Controller.extend({
  queryParams: {
    stemData: 's',
    ids: 'i'
  },

  fbAppId: config.APP.FB_APP_ID,

  ids: '8',

  stemData: null,

  transport: inject.controller(),

  metrics: inject.service(),

  preorderDigitalLink: config.APP.LINKS.PREORDER.ITUNES,

  preorderVinylLink: config.APP.LINKS.PREORDER.VINYL,

  onStems: computed.filterBy('model', 'on', true).readOnly(),

  redirectOnToggles: observer('model.@each.isReversed', 'model.@each.on', function() {
    run.next(() => this.send('updateUrl'));
  }),

  actions: {
    preorderDigital() {
      window.open(this.get('preorderDigitalLink'), '_blank');

      this.get('metrics').trackEvent({
        category: 'Preorder',
        action: 'Click',
        label: 'Digital',
        value: 8
      });
    },

    preorderVinyl() {
      window.open(this.get('preorderVinylLink'), '_blank');

      this.get('metrics').trackEvent({
        category: 'Preorder',
        action: 'Click',
        label: 'Vinyl',
        value: 25
      });
    }
  }
});
