import Ember from 'ember';
const { computed } = Ember;

export default Ember.Mixin.create({
  /**
   * @public
   * @property isReversable
   * @readonly
   * @type {Boolean}
   */
  isReversable: computed.bool('reverseFileName').readOnly(),

  /**
   * @public
   * @property reverseAudioSrc
   */
  reverseAudioSrc: null,

  /**
   * @public
   * @property reverseAudioBuffer
   * @readonly
   */
  reverseAudioBuffer: null,

  /**
   * @public
   * @property reverseGainNode
   * @type {GainNode}
   */
  reverseGainNode: null,

  /**
   * @public
   * @property isReversed
   * @type {Boolean}
   * @default false
   */
  isReversed: computed('_isReversed', {
    get() {
      return this.get('_isReversed');
    },

    set(_key, reversed) {
      this.set('_isReversed', reversed);

      if (!this.get('isReversable')) {
        return reversed;
      }

      this.set('gainNode.gain.value', reversed ? 0 : 1);
      this.set('reverseGainNode.gain.value', reversed ? 1 : 0);

      return reversed;
    }
  }),

  /**
   * @public
   * @property isReversed
   * @type {Boolean}
   * @default false
   */
  reverseAudioUrl: computed('reverseFileName', function() {
    return this.makeFileUrl('reverseFileName');
  }).readOnly(),

  urlEncode(propName) {
    if (propName !== 'isReversed') {
      return this._super(propName);
    }

    return this.get('isReversed') ? 1 : 0;
  },

  shouldPersistProperty(propName) {
    if (propName !== 'isReversed') {
      return this._super(propName);
    }

    return this.get('isReversed');
  },

  init() {
    this._super();

    if (!this.get('isReversable')) {
      return;
    }

    this.addToBufferQueue(this.get('reverseAudioUrl'), 'reverseAudioBuffer');
  },

  stop() {
    this._super();

    if (!this.get('isReversable')) {
      return;
    }

    this.get('reverseAudioSrc').stop();
  },

  play(start, stop) {
    this._super(start, stop);

    if (!this.get('isReversable')) {
      return;
    }

    const ctx = this.get('audioContext');
    const fx = this.get('fxGainNode');
    const src = ctx.createBufferSource();
    const gain = this.get('reverseGainNode');

    src.buffer = this.get('reverseAudioBuffer');
    src.connect(gain);

    this.set('reverseAudioSrc', src);

    gain.connect(fx);
    src.start(start);
    src.stop(stop);
  },

  createNodes() {
    this._super();

    if (!this.get('isReversable')) {
      return;
    }

    this.createGainNode('reverseGainNode', 0);
  },

  /**
   * @private
   * @property _isReversed
   * @default false
   * @type {Boolean}
   */
  _isReversed: false
});
