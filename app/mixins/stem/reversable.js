import Ember from 'ember';
const { computed, observer, run } = Ember;

export default Ember.Mixin.create({
  hasReverseFile: computed.bool('reverseFileName'),

  reverseAudioBuffer: null,

  reverseGainNode: null,

  isReversed: false,

  init() {
    if (!this.get('hasReverseFile')) {
      return;
    }

    run.next(() => this.loadAudio({
      url: this.get('reverseAudioUrl'),
      bufferKey: 'reverseAudioBuffer'
    }));
  },

  createGainNodes() {
    if (!this.get('hasReverseFile')) {
      return;
    }

    this.createGainNode('reverseGainNode', 0);
  },

  reverseAudioUrl: computed('reverseFileName', function() {
    return this.makeFileUrl('reverseFileName');
  }),

  toggleReversed: observer('isReversed', function() {
    if (!this.get('hasReverseFile')) {
      return;
    }

    const r = this.get('isReversed');
    this.set('gainNode.gain.value', r ? 0 : 1);
    this.set('reverseGainNode.gain.value', r ? 1 : 0);
  }),

  play(start, stop) {
    if (!this.get('hasReverseFile') || !this.get('reverseAudioBuffer')) {
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
