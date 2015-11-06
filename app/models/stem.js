import DS from 'ember-data';
import ENV from 'sprh-bulbs/config/environment';
import Ember from 'ember';
import Reversable from 'sprh-bulbs/mixins/stem/reversable';
const { computed, observer, run } = Ember;
const { attr } = DS;

const Stem = DS.Model.extend(Reversable, {
  fileName: attr(),

  reverseFileName: attr(),

  init() {
    this._super();

    this.createGainNodes();

    run.next(() => this.loadAudio({
      url: this.get('audioUrl'),
      bufferKey: 'audioBuffer'
    }));
  },

  makeFileUrl(fileName) {
    return `${ENV.APP.STEMS_BASE_URL}/${this.get(fileName)}`;
  },

  audioUrl: computed('fileName', function() {
    return this.makeFileUrl('fileName');
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
    this.set('masterGainNode.gain.value', this.get('on') ? this.get('defaultVolume') : 0);
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
    return `${ENV.APP.CDN_URL}/img/${state}/${this.get('bulbVariant')}.png`;
  },

  loadAudio(opts) {
    const { url, bufferKey } = opts;
    const ctx = this.get('audioContext');
    let req = new XMLHttpRequest();

    req.open('GET', url, true);
    req.responseType = 'arraybuffer';

    req.onload = () => ctx.decodeAudioData(
      req.response,
      (buffer) => this.set(bufferKey, buffer)
    );

    req.send();
  },

  createGainNode(key, vol = 1) {
    const node = this.get('audioContext').createGain();
    node.gain.value = vol;
    this.set(key, node);
  },

  createGainNodes() {
    this._super();
    const masterVol = this.get('on') ? this.get('defaultVolume') : 0;
    this.createGainNode('gainNode');
    this.createGainNode('masterGainNode', masterVol);
  },

  play(start, stop) {
    this._super(start, stop);

    if (!this.get('audioBuffer')) {
      return;
    }

    const ctx = this.get('audioContext');
    const masterGainNode = this.get('masterGainNode');
    const buffer = this.get('audioBuffer');
    const src = ctx.createBufferSource();
    const gainNode = this.get('gainNode');

    src.buffer = buffer;
    src.connect(gainNode);
    gainNode.connect(masterGainNode);
    masterGainNode.connect(ctx.destination);

    src.start(start);
    src.stop(stop);
  }
});

Stem.reopenClass({
  FIXTURES: ENV.APP.STEM_FIXTURES
});

export default Stem;
