import Ember from 'ember';
const { on } = Ember;

export default Ember.Component.extend({
  togglePlaying: 'togglePlaying',
  tagName: 'nav',
  classNames: ['navbar', 'navbar-default', 'navbar-fixed-top'],
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
    },
    post() {
      alert('I will post to fb');
    },
    tweet() {
      alert('I will tweet');
    },
    pin() {
      alert('I will pin');
    },
    email() {
      alert('I will email');
    },
    resetMix() {
      alert('I will reset the mix');
    }
  }
});
