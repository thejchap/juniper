import Ember from 'ember';
import Stem from 'sprh-bulbs/models/stem';
const { observer, computed } = Ember;

export default Ember.Controller.extend({
  queryParams: {
    ids: 'i',
    idsTrailingZeros: 'z',
    stemData: 's'
  },

  ids: null,

  idsTrailingZeros: 0,

  stemData: null,

  transport: Ember.inject.controller(),

  onStems: computed.filterBy('model', 'on', true).readOnly(),

  redirectOnPropChanges: observer('model.@each.encodedState', 'onStems.@each.length', function() {
    const stems = this.get('onStems');
    const metadata = Stem.urlEncodeIds(stems);
    const stemData = Stem.urlEncodeData(stems);
    let queryParams = { stemData };

    if (metadata) {
      queryParams.ids = metadata.str;
      queryParams.idsTrailingZeros = metadata.trailingZeros;
    }

    this.transitionToRoute({ queryParams });
  }),

  actions: {
    togglePlaying() {
      this.get('transport').send('togglePlaying');
    }
  }
});
