import FixtureAdapter from 'ember-data-fixture-adapter';

export default FixtureAdapter.extend({
  shouldReloadAll() {
    return true;
  }
});
