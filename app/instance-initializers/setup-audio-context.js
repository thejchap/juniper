function initialize(instance) {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioContext();
  const { registry } = instance;

  registry.register('service:audio-context', ctx, {
    instantiate: false,
    singleton: true
  });

  registry.injection('model', 'audioContext', 'service:audio-context');
  registry.injection('controller', 'audioContext', 'service:audio-context');
}

export default {
  name: 'setup-audio-context',
  initialize
};
