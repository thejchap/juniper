import Ember from 'ember';
import config from 'juniper/config/environment';
const { inject } = Ember;

export default Ember.Route.extend({
  metrics: inject.service(),

  preorderDigitalLink: config.APP.LINKS.PREORDER.ITUNES,

  preorderVinylLink: config.APP.LINKS.PREORDER.VINYL,

  actions: {
    showModal(name, model) {
      this.render(name, {
        into: 'application',
        outlet: 'modal',
        model
      });
    },

    removeModal() {
      this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    },

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
