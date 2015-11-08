import Ember from 'ember';
const { on, run } = Ember;

export default Ember.Component.extend({
  classNames: ['loading-knob'],
  bgColor: 'rgba(255, 255, 255, 0.2)',
  fgColor: '#d6ac79',
  thickness: 0.08,
  lineCap: 'round',
  displayInput: false,
  animationDuration: 300,
  displayPrevious: 'true',
  readOnly: true,
  min: 0,
  max: 100,

  changeValue: on('init', function() {
    const progress = this.get('progress');
    const cur = this.get('animatedProgress') || progress;
    this.animateValue(cur, progress);
  }).observes('progress'),

  animateValue(from, to) {
    const progress = this;

    Ember.$({ progress: from }).animate({ progress: to }, {
      duration: this.get('animationDuration'),
      step() {
        progress.set('animatedProgress', Math.floor(this.progress));
      }
    }).promise().then(() => progress.set('animatedProgress', to));
  },

  animatedProgressChanged: function() {
    const $el = this.$('.knob');

    if (!$el) {
      return;
    }

    $el.val(this.get('animatedProgress')).trigger('change');
  }.observes('animatedProgress'),

  initKnob: on('didInsertElement', function() {
    const opts = this.getProperties(
      'min',
      'max',
      'step',
      'bgColor',
      'fgColor',
      'thickness',
      'lineCap',
      'readOnly',
      'displayInput'
    );

    run.next(() => {
      this.$('.knob').knob(opts);
      this.animatedProgressChanged();
    });
  })
});
