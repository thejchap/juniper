import Ember from 'ember';
const { run, on, computed } = Ember;

export default Ember.Component.extend({
  action: 'toggleStem',
  bulbs: [],
  viewportWidth: 0,
  viewportHeight: 0,
  setViewportWidth: on('didInsertElement', function() {
    const $el = $(window);

    const updateDimensions = () => {
      this.setProperties({
        viewportWidth: $el.width(),
        viewportHeight: $el.height()
      });
    };

    run.next(updateDimensions);
    $el.resize(updateDimensions);
  }),
  actions: {
    toggleStem(stem) {
      this.sendAction('action', stem);
    }
  }
});
