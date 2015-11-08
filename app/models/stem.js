import DS from 'ember-data';
import ENV from 'sprh-bulbs/config/environment';
import Ember from 'ember';
import Reversable from 'sprh-bulbs/mixins/stem/reversable';
import Distortable from 'sprh-bulbs/mixins/stem/distortable';
import Filterable from 'sprh-bulbs/mixins/stem/filterable';
import { zeroPad } from 'sprh-bulbs/helpers/zero-pad';

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
   * @property audioSrc
   */
  audioSrc: null,

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
  width: 100,

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

  encodedState: computed('off', 'volume', 'distortionAmount', 'filterFrequency', 'isReversed', function() {
    if (this.get('off')) {
      return;
    }

    const props = Stem.PERSISTENT_PROPS;
    let numProps = 0;
    let whichProps = [];
    let prop;

    const values = Object.keys(props).map((propName) => {
      prop = props[propName];

      if (!this.shouldPersistProperty(propName)) {
        return;
      }

      whichProps.push(prop.id);
      numProps++;

      return zeroPad(this.urlEncode(propName).toString(), {
        length: prop.length
      });
    }).join('');

    if (numProps === 0) {
      return;
    }

    const str = `${numProps}${whichProps.join('')}${values}`;
    const num = parseInt(str, 10);
    const ret = num.toString(16);

    return ret;
  }).readOnly(),

  urlDecode(propName, val) {
    if (propName !== 'volume') {
      return this._super(propName, val);
    }

    return parseInt(val, 10) / 100;
  },

  urlEncode(propName) {
    if (propName !== 'volume') {
      return this._super(propName);
    }

    return parseInt(this.get(propName) * 100, 10);
  },

  shouldPersistProperty(propName) {
    if (propName !== 'volume') {
      return this._super(propName);
    }

    return this.get('volume') !== ENV.APP.DEFAULT_VOLUME;
  },

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
    const ctx = this.get('audioContext');
    const node = ctx.createGain ? ctx.createGain() : ctx.createGainNode();
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

  stop() {
    this._super();
    this.get('audioSrc').stop();
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
    this.set('audioSrc', src);
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

  PERSISTENT_PROPS: {
    volume: {
      id: 1,
      length: 2
    },

    isReversed: {
      id: 2,
      length: 1
    },

    distortionAmount: {
      id: 3,
      length: 2
    },

    filterFrequency: {
      id: 4,
      length: 5
    }
  },

  urlEncodeIds(collection) {
    if (!collection.get('length')) {
      return null;
    }

    let len;
    let str = '';

    collection.forEach((record) => {
      len = (record.get('encodedState.length') || 0).toString();

      if (len > 0) {
        str = `${str}${record.get('id')}-${len}_`;
      } else {
        str = `${str}${record.get('id')}_`;
      }
    });

    str = str.replace(/_$/, '');
    return str;
  },

  urlDecodeIds(str) {
    if (!str) {
      return [];
    }

    const tuples = str.split('_');

    let id;
    let len;
    let result = [];

    tuples.forEach((tuple) => {
      [id, len] = tuple.split('-');

      result.push({
        id: parseInt(id, 10),
        encodedStateLength: len ? parseInt(len, 10) : 0
      });
    });

    return result;
  },

  urlEncodeData(collection) {
    const states = collection.mapBy('encodedState').compact();

    if (!states.get('length')) {
      return null;
    }

    return states.join('');
  },

  urlDecodeData(str, meta) {
    if (!str) {
      return;
    }

    let i = 0;
    let j = 0;
    let chunk;
    let decodedChunk;
    let numProps;
    let whichEnd;
    let whichProps;
    let propsData;
    let result = {};
    let prop;
    let propData;

    const props = Object.keys(this.PERSISTENT_PROPS).map((k) => ({
      name: k,
      id: this.PERSISTENT_PROPS[k].id,
      length: this.PERSISTENT_PROPS[k].length
    }));

    return meta.map((info) => {
      if (info.encodedStateLength < 1) {
        return;
      }

      result = {};
      j = 0;
      chunk = str.slice(i, i + info.encodedStateLength);
      decodedChunk = parseInt(chunk, 16).toString();
      numProps = decodedChunk[0];
      whichEnd = parseInt(numProps, 10) + 1;

      whichProps = decodedChunk.slice(1, whichEnd)
        .split('')
        .map((prop) => parseInt(prop, 10));

      propsData = decodedChunk.slice(whichEnd, decodedChunk.length);

      result = {
        id: info.id,
        attributes: {}
      };

      whichProps.forEach((id) => {
        prop = props.findBy('id', id);
        propData = propsData.slice(j, j + prop.length);
        result.attributes[prop.name] = parseInt(propData, 10);
        j += prop.length;
      });

      i += info.encodedStateLength;
      return result;
    }).compact();
  },

  applyUrlData(stems, ids, stemData, store) {
    if (!ids) {
      return;
    }

    ids.forEach((id) => {
      const stem = store.peekRecord('stem', id);

      if (!stem) {
        return;
      }

      stem.set('on', true);

      if (stemData && stemData.findBy('id', id)) {
        const data = stemData.findBy('id', id).attributes;

        Object.keys(data).forEach((k) => {
          stem.set(k, stem.urlDecode(k, data[k]));
        });
      }
    });
  }
});

export default Stem;
