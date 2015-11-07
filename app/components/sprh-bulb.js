import Ember from 'ember';
const { run, on, computed } = Ember;

export default Ember.Component.extend({
  classNames: ['sprh-bulb', 'item'],

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
    },

    toggleMute() {
      this.get('stem').toggleProperty('on');
    },

    showVolumeModal() {
      this._showModal('volume');
    },

    showFilterModal() {
      this._showModal('filter');
    },

    showDistortionModal() {
      this._showModal('distortion');
    }
  }
});
