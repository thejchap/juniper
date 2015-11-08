import Ember from 'ember';
const { computed, run, observer } = Ember;

export default Ember.Mixin.create({
  distortionOverSample: '4x',

  distortionCurve: computed(function() {
    const k = 300;
    const samples = 44100;
    const deg = Math.PI / 180;
    const curve = new Float32Array(samples);
    let x;

    for (let i = 0, l = samples; i < l; i ++) {
      x = i * 2 / samples - 1;
      curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }

    return curve;
  }),

  distortionDirtyBalance: computed('distortionAmount', function() {
    return Math.cos((1 - this.get('distortionAmount')) * 0.5 * Math.PI) * 0.3;
  }),

  distortionCleanBalance: computed('distortionAmount', function() {
    return Math.cos(this.get('distortionAmount') * 0.5 * Math.PI);
  }),

  updateChannels: observer('distortionCleanBalance', 'distortionDirtyBalance', function() {
    this.set('distortionCleanNode.gain.value', this.get('distortionCleanBalance'));
    this.set('distortionGainNode.gain.value', this.get('distortionDirtyBalance'));
  }),

  urlEncode(propName) {
    if (propName !== 'distortionAmount') {
      return this._super(propName);
    }

    return parseInt(this.get('distortionAmount') * 100, 10);
  },

  urlDecode(propName, val) {
    if (propName !== 'distortionAmount') {
      return this._super(propName, val);
    }

    return parseInt(val, 10) / 100;
  },

  shouldPersistProperty(propName) {
    if (propName !== 'distortionAmount') {
      return this._super(propName);
    }

    return this.get('isDistortionManipulated');
  },

  distortionAmount: computed('_distortionAmount', {
    get() {
      return this.get('_distortionAmount');
    },

    set(_key, freq) {
      this.set('_distortionAmount', freq);
      this.set('on', true);

      return freq;
    }
  }),

  isDistortionSame: computed('distortionAmount', 'defaultDistortionAmount', function() {
    return this.get('distortionAmount') === this.get('defaultDistortionAmount');
  }),
  isDistortionManipulated: computed.not('isDistortionSame').readOnly(),

  createNodes() {
    this._super();

    this.createGainNode('distortionGainNode', this.get('distortionDirtyBalance'));
    this.createGainNode('distortionCleanNode', this.get('distortionCleanBalance'));
    this.createGainNode('distortionMasterNode');

    const ctx = this.get('audioContext');
    const distortion = ctx.createWaveShaper();

    distortion.curve = this.get('distortionCurve');
    distortion.oversample = this.get('distortionOverSample');

    this.set('distortionNode', distortion);
  },

  routeFx(node) {
    const newNode = this._super(node) || node;
    const distortion = this.get('distortionNode');
    const gain = this.get('distortionGainNode');
    const clean = this.get('distortionCleanNode');
    const master = this.get('distortionMasterNode');

    newNode.connect(clean);
    newNode.connect(distortion);
    distortion.connect(gain);
    gain.connect(master);
    clean.connect(master);

    return master;
  },

  _distortionAmount: computed.oneWay('defaultDistortionAmount'),
  defaultDistortionAmount: 0,
  minDistortionAmount: computed.alias('defaultDistortionAmount').readOnly(),
  maxDistortionAmount: 1
});
