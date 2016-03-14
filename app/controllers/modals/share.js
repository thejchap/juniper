import Ember from 'ember';
import Notify from 'ember-notify';
const { inject } = Ember;
const J4GSV6 = atob('NWJkNTFjZTFkOTI4M2Q1MWYxNTAzMGQwZjA3MmIwNDUwN2E1ZjVkZg==');

export default Ember.Controller.extend({
  metrics: inject.service(),

  notify: inject.service(),

  _track(label) {
    this.get('metrics').trackEvent({
      category: 'Social',
      action: 'Share Button Clicked',
      label
    });
  },

  _uErr() {
    this.get('notify').alert('An error occurred generating your remix link. Please copy and paste from the browser\'s address bar.');
  },

  _f4bq() {
    //let longUrl = window.location.href;
    let longUrl = `http://juniper.squarepegroundhole.me/${window.location.hash}`;
    let self = this;

    return new Promise((resolve, reject) => {
      Ember.$.ajax({
        url: atob('aHR0cHM6Ly9hcGktc3NsLmJpdGx5LmNvbS92My9zaG9ydGVu'),
        dataType: 'json',
        data: {
          format: 'json',
          access_token: J4GSV6,
          longUrl
        },
        success(res) {
          res.status_code === 200 ? resolve(res.data.url) : self._uErr();
        },
        error() {
          self._uErr();
        }
      });
    });
  },

  actions: {
    twitter() {
      this._track('Twitter');
    },
    email() {
      this._track('Email');
    },
    facebook() {
      this._track('Facebook');

      this._f4bq().then((href) => {
        FB.ui({
          method: 'share',
          href
        });
      });
    },
    close() {
      this.send('removeModal');
    }
  }
});
