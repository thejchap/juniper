import Ember from 'ember';
const { on, run } = Ember;

export default Ember.Component.extend({
  classNames: ['knob-component'],
  min: 0,
  max: 99,
  bgColor: 'rgba(255, 255, 255, 0.2)',
  fgColor: '#d6ac79',
  thickness: 0.08,
  lineCap: 'round',
  step: 1,
  displayInput: false,
  readOnly: false,

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

    const self = this;

    run.next(() => this.$('.knob').knob(Ember.merge(opts, {
      change(value) {
        self.set('value', value);
      },
      release() {
        self.sendAction('onRelease');
      }
    })));
  })
});
