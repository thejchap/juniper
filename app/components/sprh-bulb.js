import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['sprh-bulb', 'item'],
  classNameBindings: ['stem.on:on:off'],
  stem: null,
  action: 'toggleStem',
  click() {
    this.sendAction('action', this.get('stem'));
  }
});
