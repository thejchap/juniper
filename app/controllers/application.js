import Ember from 'ember';
import config from 'juniper/config/environment';

export default Ember.Controller.extend({
  fbAppId: config.APP.FB_APP_ID,
});
