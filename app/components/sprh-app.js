import Ember from 'ember';
const { observer } = Ember;

export default Ember.Component.extend({
  classNames: ['container'],
  isMixing: false,
  isSharing: false,
  updateBodyMixingClass: observer('isMixing', function() {
    const $el = Ember.$('body');

    if (this.get('isMixing')) {
      $el.addClass('show-menu is-mixing');
      return;
    }

    $el.removeClass('show-menu is-mixing');
  }),
  updateSharingBodyClass: observer('isSharing', function() {
    const $el = Ember.$('body');

    if (this.get('isSharing')) {
      $el.addClass('show-menu is-sharing');
      return;
    }

    $el.removeClass('show-menu is-sharing');
  }),
  actions: {
    toggleMixing() {
      this.toggleProperty('isMixing');
    },

    toggleSharing() {
      this.toggleProperty('isSharing');
    }
  }
});
