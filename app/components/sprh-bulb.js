import Ember from 'ember';
const { run } = Ember;

export default Ember.Component.extend({
  classNames: ['sprh-bulb', 'item'],

  classNameBindings: ['stem.on:on:off', 'isHovered'],

  showModal: 'showModal',

  isHovered: false,

  stem: null,

  action: 'toggleStem',

  mouseLeave() {
    if (Ember.$('body').hasClass('modal-open')) {
      return;
    }

    this.set('isHovered', false);
  },

  mouseEnter() {
    run.later(() => {
      if (this.$().is(':hover')) {
        this.set('isHovered', true);
      }
    }, 500);
  },

  click() {
    this.get('stem').toggleProperty('on');
  },

  _showModal(which) {
    this.sendAction('showModal', `modals/bulb-controls/${which}`, this.get('stem'));

    run.next(() => {
      Ember.$('.modal').on('hidden.bs.modal', () => {
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
