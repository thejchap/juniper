import DS from 'ember-data';
import ENV from 'sprh-bulbs/config/environment';
import Ember from 'ember';
import Reversable from 'sprh-bulbs/mixins/stem/reversable';
const { computed, observer, run } = Ember;
const { attr } = DS;

const Stem = DS.Model.extend(
  Reversable,
{
  /**
   * @public
   * @property fileName
   * @description Name of the normal MP3 file hosted on the CDN
   */
  fileName: attr(),

  /**
   * @public
   * @property reverseFileName
   * @description Name of the reversed MP3 file hosted on the CDN
   */
  reverseFileName: attr(),

  bufferQueue: [],

  audioBuffer: null,

  defaultVolume: ENV.APP.DEFAULT_VOLUME,

  volume: null,

  gainNode: null,

  on: false,

  off: computed.not('on'),

  audioUrl: computed('fileName', function() {
    return this.makeFileUrl('fileName');
  }),

  width: computed(() => {
    return Math.floor(Math.random() * 80) + 40;
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

  toggleMute: observer('on', function() {
    this.set('masterGainNode.gain.value', this.get('on') ? this.get('defaultVolume') : 0);
  }),

  init() {
    this._super();
    this.createGainNodes();
    this.addToBufferQueue(this.get('audioUrl'), 'audioBuffer');
  },

  loadAudio() {
    return Promise.all(this.get('bufferQueue'));
  },

  addToBufferQueue(url, key) {
    this.get('bufferQueue').pushObject(this.loadBuffer(url, key));
  },

  loadBuffer(url, key) {
    return new Promise((resolve) => {
      const ctx = this.get('audioContext');
      let req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.responseType = 'arraybuffer';

      req.onload = () => ctx.decodeAudioData(req.response, (buffer) => {
        this.set(key, buffer);
        resolve();
      });

      run.next(() => req.send());
    });
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
  },

  makeFileUrl(fileName) {
    return `${ENV.APP.STEMS_BASE_URL}/${this.get(fileName)}`;
  },

  _makeBulbUrl(state) {
    return `${ENV.APP.CDN_URL}/img/${state}/${this.get('bulbVariant')}.png`;
  }
});

Stem.reopenClass({
  FIXTURES: ENV.APP.STEM_FIXTURES,

  urlEncode(stems) {
  },

  urlDecode(string) {
  }
});

export default Stem;
