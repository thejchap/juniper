import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    showModal(name, model) {
      this.render(name, {
        into: 'application',
        outlet: 'modal',
        model
      });
    },

    removeModal() {
      this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});
