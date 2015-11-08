import Ember from 'ember';
import Stem from 'sprh-bulbs/models/stem';

export default Ember.Route.extend({
  model(params) {
    const loadStems = this.store.findAll('stem');
    const meta = Stem.urlDecodeIds(params.ids);
    const stemData = Stem.urlDecodeData(params.stemData, meta);
    const ids = meta.mapBy('id');

    return loadStems.then((stems) => {
      if (ids) {
        ids.forEach((id) => {
          const stem = this.store.peekRecord('stem', id);

          if (!stem) {
            return;
          }

          stem.set('on', true);

          if (stemData && stemData.findBy('id', id)) {
            const data = stemData.findBy('id', id).attributes;

            Object.keys(data).forEach((k) => {
              stem.set(k, stem.urlDecode(k, data[k]));
            });
          }
        });
      }

      const loadAudio = Promise.all(stems.invoke('loadAudio'));
      return loadAudio.then(() => stems);
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    const transport = controller.get('transport');

    transport.set('stems', model);
    transport.send('play');
  },

  actions: {
    toggleStem(stem) {
      stem.toggleProperty('on');
    }
  }
});
