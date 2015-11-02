import DS from 'ember-data';
import ENV from 'sprh-bulbs/config/environment';
import Ember from 'ember';
const { computed, observer } = Ember;
const { attr } = DS;

const Stem = DS.Model.extend({
  fileName: attr(),

  audioUrl: computed('fileName', function() {
    return `${ENV.APP.STEMS_BASE_URL}/${this.get('fileName')}`;
  }),

  on: false,

  off: computed.not('on'),

  width: computed(() => {
    return Math.floor(Math.random() * 80) + 40;
  }),

  init() {
    const audio = new Audio();
    audio.mediaGroup = ENV.APP.MEDIA_GROUP;
    audio.muted = true;
    this.set('audio', audio);
  },

  toggleMute: observer('on', function() {
    this.get('audio').muted = !this.get('on');
  }),

  bulbVariant: computed('id', function() {
    const id = this.get('id');
    const opts = ENV.APP.BULB_VARIANTS;
    return ((id + Math.floor(Math.random() * 4) + 0) % opts) + 1;
  }),

  onBulbUrl: computed('bulbVariant', function() {
    return this._makeBulbUrl('on');
  }),

  offBulbUrl: computed('bulbVariant', function() {
    return this._makeBulbUrl('off');
  }),

  _makeBulbUrl(state) {
    return `${ENV.APP.CDN_URL}/img/${state}/${this.get('bulbVariant')}.jpg`;
  }
});

Stem.reopenClass({
  FIXTURES: ENV.APP.STEM_FIXTURES
});

export default Stem;
