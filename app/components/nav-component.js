import Ember from 'ember';
import config from 'juniper/config/environment';
const { on, inject } = Ember;

export default Ember.Component.extend({
  metrics: inject.service(),
  preorderLink: config.APP.LINKS.PREORDER,
  togglePlaying: 'togglePlaying',
  showShareModal: 'showShareModal',
  tagName: 'nav',
  classNames: ['navbar', 'navbar-default', 'navbar-fixed-top'],
  j4gsv6: '5bd51ce1d9283d51f15030d0f072b04507a5f5df',
  setupKeyboardShortcuts: on('didInsertElement', function() {
    Ember.$(document).keypress((e) => {
      switch (e.which) {
        case 32:
          e.preventDefault();
          this.get('transport').send('togglePlaying');
          break;
        default: return;
      }
    });
  }),

  setupHoverListeners: on('didInsertElement', function() {
    this.$('.hover-btn').mouseenter(function() {
      Ember.$(this).closest('.actions-nav').addClass('hovered');
    });

    this.$('.actions-nav').mouseleave(function() {
      Ember.$(this).removeClass('hovered');
    });
  }),
  actions: {
    togglePlaying() {
      this.get('transport').send('togglePlaying');

      let isPlaying = this.get('transport.isPlaying');

      this.get('metrics').trackEvent({
        category: 'Transport',
        action: isPlaying ? 'Play' : 'Pause'
      });
    },

    preorder() {
      window.open(this.get('preorderLink'), '_blank');

      this.get('metrics').trackEvent({
        category: 'Preorder Button',
        action: 'Click'
      });
    },

    showShareModal() {
      this.sendAction('showShareModal');

      this.get('metrics').trackEvent({
        category: 'Social',
        action: 'Open Modal'
      });
    }
  }
});
