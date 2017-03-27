import Ember from 'ember';
import config from 'juniper/config/environment';
const { on, inject } = Ember;

export default Ember.Component.extend({
  metrics: inject.service(),
  preorderDigitalLink: config.APP.LINKS.PREORDER.ITUNES,
  preorderVinylLink: config.APP.LINKS.PREORDER.VINYL,
  preorderDigital: 'preorderDigital',
  startTour: 'startTour',
  resetMix: 'resetMix',
  preorderVinyl: 'preorderVinyl',
  togglePlaying: 'togglePlaying',
  showShareModal: 'showShareModal',
  tagName: 'nav',
  classNames: ['navbar', 'navbar-default', 'navbar-fixed-top'],
  initTooltips: on('didInsertElement', function() {
    this.$('[data-toggle="tooltip"]').tooltip();
  }),

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

    showShareModal() {
      this.sendAction('showShareModal');

      this.get('metrics').trackEvent({
        category: 'Social',
        action: 'Open Modal'
      });
    },

    preorderVinyl() {
      this.sendAction('preorderVinyl');
    },

    resetMix() {
      this.sendAction('resetMix');
    },

    startTour() {
      this.sendAction('startTour');
    },

    preorderDigital() {
      this.sendAction('preorderDigital');
    }
  }
});
