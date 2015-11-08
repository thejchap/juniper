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

  urlDecode(propName, val) {
    if (propName !== 'filterFrequency') {
      return this._super(propName, val);
    }

    return parseInt(val, 10);
  },

  urlEncode(propName) {
    if (propName !== 'filterFrequency') {
      return this._super(propName);
    }

    return parseInt(this.get('filterFrequency'), 10);
  },

  shouldPersistProperty(propName) {
    if (propName !== 'filterFrequency') {
      return this._super(propName);
    }

    return this.get(propName) !== this.get('defaultFilterFrequency');
  },

  routeFx(node) {
    const newNode = this._super(node) || node;
    const filter = this.get('filterNode');
    newNode.connect(filter);
    return filter;
  },

  _filterFrequency: computed.oneWay('defaultFilterFrequency'),
  defaultFilterFrequency: 19000,
  minFilterFrequency: 60,
  maxFilterFrequency: computed.oneWay('defaultFilterFrequency').readOnly()
});
