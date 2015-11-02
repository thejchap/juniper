import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    const bin = parseInt(params.mixHex, 16)
      .toString(2)
      .split('')
      .map((i) => parseInt(i, 10));

    return this.store.findAll('stem').then((stems) => {
      const indices = bin.map((on, i) => on ? i : null).compact();
      stems.objectsAt(indices).setEach('on', true);
      return stems;
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    const transport = controller.get('transport');
    transport.set('stems', model);
    transport.send('play');

    window.stop = () => transport.send('stop');
  },

  actions: {
    toggleStem(stem) {
      stem.toggleProperty('on');

      const binary = this.get('currentModel').map((stem) => {
        return stem.get('on') ? 1 : 0;
      }).join('');

      const mixHex = parseInt(binary, 2).toString(16);
      this.transitionTo({ queryParams: { mixHex } });
    }
  }
});
