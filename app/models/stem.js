import DS from 'ember-data';
import ENV from 'sprh-bulbs/config/environment';
import Ember from 'ember';
import Reversable from 'sprh-bulbs/mixins/stem/reversable';
import Distortable from 'sprh-bulbs/mixins/stem/distortable';
import Filterable from 'sprh-bulbs/mixins/stem/filterable';

const { computed, run, assert } = Ember;
const { attr } = DS;

const Stem = DS.Model.extend(
  Reversable,
  Distortable,
  Filterable,
{
  /**
   * @public
   * @property fileName
   * @type {String}
   * @description Name of the normal MP3 file hosted on the CDN
   */
  fileName: attr(),

  /**
   * @public
   * @property reverseFileName
   * @type {String}
   * @description Name of the reversed MP3 file hosted on the CDN
   */
  reverseFileName: attr(),

  /**
   * @public
   * @property bufferQueue
   * @type {Array}
   * @description Array of audio-loading promises
   */
  bufferQueue: [],

  /**
   * @public
   * @property bufferQueue
   * @type {Array}
   * @description Array of audio-loading promises
   */
  audioBuffer: null,

  /**
   * @public
   * @property volume
   * @type {Number}
   */
  volume: computed('_volume', {
    get() {
      return this.get('_volume') || ENV.APP.DEFAULT_VOLUME;
    },

    set(_key, volume) {
      this.set('_volume', volume);
      this.set('masterGainNode.gain.value', volume);
      this.set('on', true);

      return volume;
    }
  }),

  /**
   * @public
   * @property gainNode
   * @type {GainNode}
   */
  gainNode: null,

  /**
   * @public
   * @property masterGainNode
   * @type {GainNode}
   */
  masterGainNode: null,


  /**
   * @public
   * @property fxGainNode
   * @type {GainNode}
   */
  fxGainNode: null,

  /**
   * @public
   * @property on
   * @type {Boolean}
   * @default false
   */
  on: computed('_on', {
    get() {
      return this.get('_on');
    },

    set(_key, on) {
      const vol = this.get('volume');
      const key = 'masterGainNode.gain.value';

      this.set('_on', on);
      this.set(key, on ? vol : 0);

      return on;
    }
  }),

  /**
   * @public
   * @property off
   * @readonly
   * @type {Boolean}
   */
  off: computed.not('on').readOnly(),

  /**
   * @public
   * @property volumeIconClass
   * @readonly
   * @type {String}
   */
  volumeIconClass: computed('volume', function() {
    const n = this.get('volume');

    if (n <= 0.4) {
      return 'ion-volume-low';
    } else if (n > 0.4 && n <= 0.8) {
      return 'ion-volume-medium';
    } else {
      return 'ion-volume-high';
    }
  }).readOnly(),

  /**
   * @public
   * @property audioUrl
   * @readonly
   * @type {String}
   */
  audioUrl: computed('fileName', function() {
    return this.makeFileUrl('fileName');
  }).readOnly(),

  /**
   * @public
   * @property width
   * @readonly
   * @type {Number}
   */
  width: computed(() => {
    return Math.floor(Math.random() * 100) + 60;
  }).readOnly(),

  /**
   * @public
   * @property bulbVariant
   * @readonly
   * @type {Number}
   */
  bulbVariant: computed('id', function() {
    return (this.get('id') % ENV.APP.BULB_VARIANTS) + 1;
  }).readOnly(),

  /**
   * @public
   * @property onBulbUrl
   * @readonly
   * @type {String}
   */
  onBulbUrl: computed('bulbVariant', function() {
    return this._makeBulbUrl('on');
  }).readOnly(),

  /**
   * @public
   * @property offBulbUrl
   * @readonly
   * @type {String}
   */
  offBulbUrl: computed('bulbVariant', function() {
    return this._makeBulbUrl('off');
  }).readOnly(),

  /**
   * @public
   * @method init
   */
  init() {
    this._super();
    this.createNodes();
    this.addToBufferQueue(this.get('audioUrl'), 'audioBuffer');
  },

  /**
   * @public
   * @return {Promise}
   */
  loadAudio() {
    return Promise.all(this.get('bufferQueue'));
  },

  /**
   * @public
   * @param {String} url
   * @param {String} key
   */
  addToBufferQueue(url, key) {
    return this.get('bufferQueue').pushObject(this._loadBuffer(url, key));
  },

  createGainNode(key, vol = 1) {
    const node = this.get('audioContext').createGain();
    node.gain.value = vol;
    return this.set(key, node);
  },

  createNodes() {
    this._super();
    const masterVol = this.get('on') ? this.get('volume') : 0;
    this.createGainNode('gainNode');
    this.createGainNode('fxGainNode', 1);
    this.createGainNode('masterGainNode', masterVol);
  },

  play(start, stop) {
    if (ENV.APP.SKIP_AUDIO) {
      return;
    }

    assert(`Invalid start value for .play: ${start}`, start);
    assert(`Invalid stop value for .play: ${stop}`, stop);

    this._super(start, stop);

    const ctx = this.get('audioContext');
    const master = this.get('masterGainNode');
    const fx = this.get('fxGainNode');
    const gain = this.get('gainNode');
    const src = ctx.createBufferSource();

    src.buffer = this.get('audioBuffer');
    src.connect(gain);
    gain.connect(fx);

    const buss = this.routeFx(fx);

    buss.connect(master);
    master.connect(ctx.destination);
    src.start(start);
    src.stop(stop);
  },

  routeFx(node) {
    return this._super(node) || node;
  },

  makeFileUrl(fileName) {
    return `${ENV.APP.CDN_URL}/audio/${this.get(fileName)}`;
  },

  _on: false,

  _volume: null,

  _makeBulbUrl(state) {
    return `${ENV.APP.CDN_URL}/img/${state}/${this.get('bulbVariant')}.png`;
  },

  _loadBuffer(url, key) {
    return new Promise((resolve) => {
      const ctx = this.get('audioContext');
      let req = new XMLHttpRequest();

      req.open('GET', url, true);
      req.responseType = 'arraybuffer';

      if (ENV.APP.SKIP_AUDIO) {
        return resolve();
      }

      req.onload = () => ctx.decodeAudioData(req.response, (buffer) => {
        this.set(key, buffer);
        resolve();
      });

      run.next(() => req.send());
    });
  }
});

Stem.reopenClass({
  FIXTURES: ENV.APP.STEM_FIXTURES,

  urlEncode(/* collection */) {
  },

  urlDecode(/* string */) {
  }
});

export default Stem;
