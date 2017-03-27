function initialize(app) {
  if (!Modernizr.webaudio) {
    return;
  }

  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  const ctx = new AudioContext();

  app.register('service:audio-context', ctx, {
    instantiate: false,
    singleton: true
  });

  app.inject('model', 'audioContext', 'service:audio-context');
  app.inject('controller', 'audioContext', 'service:audio-context');
}

export default {
  name: 'setup-audio-context',
  initialize
};
