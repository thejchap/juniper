import Ember from 'ember';
import config from 'juniper/config/environment';

export default Ember.Controller.extend({
  preorderVinylLink: config.APP.LINKS.PREORDER.VINYL,
  preorderDigitalLink: config.APP.LINKS.PREORDER.ITUNES
});
