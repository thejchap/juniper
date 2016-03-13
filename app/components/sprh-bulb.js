import Ember from 'ember';
const { run, on, computed, inject } = Ember;

export default Ember.Component.extend({
  metrics: inject.service(),

  classNames: ['sprh-bulb', 'item'],

  bulbToggled: 'updateUrl',

  classNameBindings: [
    'stem.on:on:off',
    'isHovered',
    'isGridLayoutComplete',
    'bulbVariantClass'
  ],

  bulbVariantClass: computed('stem.bulbVariant', function() {
    return `bulb-variant-${this.get('stem.bulbVariant')}`;
  }),

  showModal: 'showModal',

  isHovered: false,

  stem: null,

  action: 'toggleStem',

  isGridLayoutComplete: false,

  listenForLayoutCompletion: on('didInsertElement', function() {
    run.next(() => this.$().parent().one('layoutComplete', () => {
      this.set('isGridLayoutComplete', true);
    }));
  }),

  mouseLeave() {
    if (Ember.$('body').hasClass('modal-open')) {
      return;
    }

    this.set('isHovered', false);
  },

  mouseEnter() {
    run.later(() => {
      if (!this.$().is(':hover')) {
        return;
      }

      this.set('isHovered', true);
    }, 500);
  },

  click() {
    this.get('stem').toggleProperty('on');
    let on = this.get('stem.on');

    this.get('metrics').trackEvent({
      category: 'Stem',
      action: `${on ? 'Unmute' : 'Mute'} - Bulb`,
      label: this.get('stem.name')
    });
  },

  _showModal(which) {
    this.sendAction('showModal', `modals/bulb-controls/${which}`, this.get('stem'));

    run.next(() => {
      Ember.$('.modal').on('hide.bs.modal', () => {
        this.set('isHovered', false);
      });
    });
  },

  actions: {
    toggleReverse() {
      this.get('stem').toggleProperty('isReversed');
      let reversed = this.get('stem.isReversed');

      this.get('metrics').trackEvent({
        category: 'Stem',
        action: reversed ? 'Reverse' : 'Forward',
        label: this.get('stem.name')
      });
    },

    toggleMute() {
      this.get('stem').toggleProperty('on');
      let on = this.get('stem.on');

      this.get('metrics').trackEvent({
        category: 'Stem',
        action: `${on ? 'Unmute' : 'Mute'} - Icon`,
        label: this.get('stem.name')
      });
    },

    showVolumeModal() {
      this._showModal('volume');

      this.get('metrics').trackEvent({
        category: 'Stem',
        action: 'Open Modal - Volume',
        label: this.get('stem.name')
      });
    },

    showFilterModal() {
      this._showModal('filter');

      this.get('metrics').trackEvent({
        category: 'Stem',
        action: 'Open Modal - Filter',
        label: this.get('stem.name')
      });
    },

    showDistortionModal() {
      this._showModal('distortion');

      this.get('metrics').trackEvent({
        category: 'Stem',
        action: 'Open Modal - Distortion',
        label: this.get('stem.name')
      });
    }
  }
});
