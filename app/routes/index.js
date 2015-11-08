import Ember from 'ember';
import Stem from 'juniper/models/stem';
const { run } = Ember;

export default Ember.Route.extend({
  model(params) {
    const loadStems = this.store.findAll('stem');
    const meta = Stem.urlDecodeIds(params.ids);
    const stemData = Stem.urlDecodeData(params.stemData, meta);
    const ids = meta.mapBy('id');

    return loadStems.then((stems) => {
      Stem.applyUrlData(stems, ids, stemData, this.store);
      const loadAudio = Promise.all(stems.invoke('loadAudio'));
      return loadAudio.then(() => stems);
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    const transport = controller.get('transport');

    transport.set('stems', model);
    run.later(() => transport.send('play'), 400);
  },

  actions: {
    toggleStem(stem) {
      stem.toggleProperty('on');
    },

    updateUrl() {
      const stems = this.get('controller.onStems');
      const ids = Stem.urlEncodeIds(stems);
      const stemData = Stem.urlEncodeData(stems);
      let queryParams = { stemData, ids };
      this.transitionTo({ queryParams });
    }
  }
});
