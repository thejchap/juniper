import Ember from 'ember';
const { computed, observer } = Ember;

export default Ember.Mixin.create({
  reversable: computed.bool('reverseFileName'),

  reverseAudioBuffer: null,

  reverseGainNode: null,

  isReversed: false,

  init() {
    if (!this.get('reversable')) {
      return;
    }

    this.addToBufferQueue(this.get('reverseAudioUrl'), 'reverseAudioBuffer');
  },

  createGainNodes() {
    if (!this.get('reversable')) {
      return;
    }

    this.createGainNode('reverseGainNode', 0);
  },

  reverseAudioUrl: computed('reverseFileName', function() {
    return this.makeFileUrl('reverseFileName');
  }),

  toggleReversed: observer('isReversed', function() {
    if (!this.get('reversable')) {
      return;
    }

    const r = this.get('isReversed');
    this.set('gainNode.gain.value', r ? 0 : 1);
    this.set('reverseGainNode.gain.value', r ? 1 : 0);
  }),

  play(start, stop) {
    if (!this.get('reversable')) {
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
  }
});
