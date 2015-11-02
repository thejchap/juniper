import DS from 'ember-data';
import ENV from 'sprh-bulbs/config/environment';
import Ember from 'ember';
const { computed, observer, run } = Ember;
const { attr } = DS;

const Stem = DS.Model.extend({
  fileName: attr(),

  init() {
    this._initGainNode();
    run.next(() => this._loadAudio());
  },

  audioUrl: computed('fileName', function() {
    return `${ENV.APP.STEMS_BASE_URL}/${this.get('fileName')}`;
  }),

  audioBuffer: null,

  defaultVolume: ENV.APP.DEFAULT_VOLUME,

  volume: null,

  gainNode: null,

  on: false,

  off: computed.not('on'),

  width: computed(() => {
    return Math.floor(Math.random() * 80) + 40;
  }),

  toggleMute: observer('on', function() {
    this.set('gainNode.gain.value', this.get('on') ? this.get('defaultVolume') : 0);
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
  },

  _loadAudio() {
    const ctx = this.get('audioContext');
    let req = new XMLHttpRequest();
    req.open('GET', this.get('audioUrl'), true);
    req.responseType = 'arraybuffer';

    req.onload = () => {
      ctx.decodeAudioData(req.response, (buffer) => {
        this.set('audioBuffer', buffer);
      });
    };

    req.send();
  },

  _initGainNode() {
    const gainNode = this.get('audioContext').createGain();
    gainNode.gain.value = this.get('on') ? this.get('defaultVolume') : 0;
    this.set('gainNode', gainNode);
  },

  play(start, stop) {
    if (!this.get('audioBuffer')) {
      return false;
    }

    const buffer = this.get('audioBuffer');
    const ctx = this.get('audioContext');
    const src = ctx.createBufferSource();
    const gainNode = this.get('gainNode');

    src.buffer = buffer;
    src.connect(gainNode);
    gainNode.connect(ctx.destination);
    src.start(start);
    src.stop(stop);
  }
});

Stem.reopenClass({
  FIXTURES: ENV.APP.STEM_FIXTURES
});

export default Stem;
