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
   * @property reverseAudioBuffer
   * @readonly
   * @type {AudioBuffer}
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

  init() {
    this._super();

    if (!this.get('isReversable')) {
      return;
    }

    this.addToBufferQueue(this.get('reverseAudioUrl'), 'reverseAudioBuffer');
  },

  play(start, stop) {
    this._super(start, stop);

    if (!this.get('isReversable')) {
      return;
    }

    const ctx = this.get('audioContext');
    const masterGainNode = this.get('masterGainNode');
    const reverseBuffer = this.get('reverseAudioBuffer');
    const reverseSrc = ctx.createBufferSource();
    const reverseGainNode = this.get('reverseGainNode');

    reverseSrc.buffer = reverseBuffer;
    reverseSrc.connect(reverseGainNode);
    reverseGainNode.connect(masterGainNode);

    reverseSrc.start(start);
    reverseSrc.stop(stop);
  },

  createGainNodes() {
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
