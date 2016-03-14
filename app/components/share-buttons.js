import Ember from 'ember';
const { inject, on } = Ember;
const J4GSV6 = atob('NWJkNTFjZTFkOTI4M2Q1MWYxNTAzMGQwZjA3MmIwNDUwN2E1ZjVkZg==');

export default Ember.Component.extend({
  classNames: ['share-modal-content'],

  metrics: inject.service(),

  notify: inject.service(),

  lsl: on('didInsertElement', function() {
    this._f4bq().then((l) => {
      this.set('sl', l);
    });
  }),

  _track(label) {
    this.get('metrics').trackEvent({
      category: 'Social',
      action: 'Share Button Clicked',
      label
    });
  },

  _successMsg() {
    this.get('notify').success('Remix shared successfully!');
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
          return res.status_code === 200 ? resolve(res.data.url) : self._uErr();
        },
        error() {
          self._uErr();
          reject();
        }
      });
    });
  },

  actions: {
    twitter() {
      this._track('Twitter');
      let text = window.encodeURI('Check out my Square Peg Round Hole "Juniper" Remix!');
      let hashtags = 'juniperremixes,squarepegroundhole';
      let url = window.encodeURI(this.get('sl'));

      window.open(`https://twitter.com/intent/tweet?text=${text}&hashtags=${hashtags}&url=${url}`, '_blank');
      this._successMsg();
    },
    email() {
      this._track('Email');
      let text = window.encodeURI(`Check out my Square Peg Round Hole "Juniper" Remix! ${this.get('sl')}`);
      let subject = window.encodeURI('My Juniper Remix');

      window.open(`mailto:?body=${text}&subject=${subject}`);
      this._successMsg();
    },
    copy() {
      this._track('Copy');
    },
    facebook() {
      this._track('Facebook');
      let href = this.get('sl');

      FB.ui({
        method: 'share',
        href
      }, () => {
        this._successMsg();
      });
    }
  }
});
