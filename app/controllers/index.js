import Ember from 'ember';
import Stem from 'juniper/models/stem';
const { observer, computed, run } = Ember;

export default Ember.Controller.extend({
  queryParams: {
    stemData: 's',
    ids: 'i'
  },

  ids: null,

  stemData: null,

  transport: Ember.inject.controller(),

  onStems: computed.filterBy('model', 'on', true).readOnly(),

  redirectOnPropChanges: observer('model.@each.encodedState', 'onStems.@each.length', function() {
    const stems = this.get('onStems');
    const ids = Stem.urlEncodeIds(stems);
    const stemData = Stem.urlEncodeData(stems);
    let queryParams = { stemData, ids };

    run.next(() => this.transitionToRoute({ queryParams }));
  }),

  actions: {
    togglePlaying() {
      this.get('transport').send('togglePlaying');
    }
  }
});
