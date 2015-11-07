import Ember from 'ember';
const { computed } = Ember;

export default Ember.Mixin.create({
  filterType: 'lowpass',

  filterQ: 5,

  filterFrequency: computed('_filterFrequency', {
    get() {
      return this.get('_filterFrequency');
    },

    set(_key, freq) {
      this.set('_filterFrequency', freq);
      this.set('filterNode.frequency.value', freq);
      this.set('on', true);

      return freq;
    }
  }),

  createNodes() {
    this._super();

    const ctx = this.get('audioContext');
    const filter = ctx.createBiquadFilter();

    filter.type = this.get('filterType');
    filter.frequency.value = this.get('filterFrequency');
    filter.Q.value = this.get('filterQ');

    this.set('filterNode', filter);
  },

  routeFx(node) {
    const newNode = this._super(node) || node;
    const filter = this.get('filterNode');
    newNode.connect(filter);
    return filter;
  },

  _filterFrequency: 19999
});
