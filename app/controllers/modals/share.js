import Ember from 'ember';
const { inject } = Ember;

export default Ember.Controller.extend({
  metrics: inject.service(),

  actions: {
    twitter() {
      this.get('metrics').trackEvent({
        category: 'Social',
        action: 'Share Button Clicked',
        label: 'Twitter'
      });
    },
    email() {
      this.get('metrics').trackEvent({
        category: 'Social',
        action: 'Share Button Clicked',
        label: 'Email'
      });
    },
    facebook() {
      this.get('metrics').trackEvent({
        category: 'Social',
        action: 'Share Button Clicked',
        label: 'Facebook'
      });
    },
    close() {
      this.send('removeModal');
    }
  }
});
