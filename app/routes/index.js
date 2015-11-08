import Ember from 'ember';
import Stem from 'juniper/models/stem';

export default Ember.Route.extend({
  model(params) {
    const loadStems = this.store.findAll('stem');
    const meta = Stem.urlDecodeIds(params.ids);
    const stemData = Stem.urlDecodeData(params.stemData, meta);
    const ids = meta.mapBy('id');

    return loadStems.then((stems) => {
      return Stem.applyUrlData(stems, ids, stemData, this.store);
    });
  },

  renderTemplate() {
    this._super();

    this.send('showModal', 'modals/loading', this.get('currentModel').getEach('bufferQueue'));
  },

  setupController(controller, model) {
    this._super(controller, model);
    const transport = controller.get('transport');
    const loadAudio = Promise.all(model.invoke('loadAudio'));
    transport.set('stems', model);
    loadAudio.then(() => transport.send('play'));
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
