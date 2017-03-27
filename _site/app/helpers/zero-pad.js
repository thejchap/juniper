import Ember from 'ember';

export function zeroPad(num, hash = {}) {
  let encoded = (num || '').toString();

  while (encoded.length < (hash.length || 2)) {
    encoded = `0${encoded}`;
  }

  return encoded;
}

export default Ember.Helper.helper(zeroPad);
