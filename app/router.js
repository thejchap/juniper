import Ember from 'ember';
import config from './config/environment';
const { inject } = Ember;

const Router = Ember.Router.extend({
  location: config.locationType,
  metrics: inject.service(),

  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },

  _trackPage() {
    Ember.run.scheduleOnce('afterRender', this, () => {
      const page = document.location.pathname;
      const title = this.getWithDefault('currentRouteName', 'unknown');
      this.get('metrics').trackPage({ page, title });
    });
  }
});

Router.map(function() {
});

export default Router;
