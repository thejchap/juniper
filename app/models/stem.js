import DS from 'ember-data';
import ENV from 'sprh-bulbs/config/environment';
import Ember from 'ember';
const { computed } = Ember;

const Stem = DS.Model.extend({
  on: false,
  off: computed.not('on'),
  onBulbUrl: computed(() => `${ENV.APP.CDN_URL}/img/on/1.jpg`),
  offBulbUrl: computed(() => `${ENV.APP.CDN_URL}/img/off/1.jpg`)
});

Stem.reopenClass({
  FIXTURES: ENV.APP.STEM_FIXTURES
});

export default Stem;
