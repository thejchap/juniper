/* jshint node: true */

var fs = require('fs');

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'juniper',
    environment: environment,
    baseURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    metricsAdapters: [{
      name: 'GoogleAnalytics',
      config: {
        id: 'UA-75015010-1'
      }
    }],

    APP: {
      LINKS: {
        PREORDER: {
          ITUNES: 'http://apple.co/1YSEuuk',
          VINYL: 'http://bit.ly/1M2XbcA'
        }
      },
      SKIP_AUDIO: false,
      CDN_URL: '//sprh.s3.amazonaws.com/bulbs',
      TEMPO: 164.0,
      BULB_VARIANTS: 4,
      DEFAULT_VOLUME: 0.75,
      FB_APP_ID: '484220698406686',
      STEM_FIXTURES: JSON.parse(fs.readFileSync(__dirname + '/stems.json', 'utf8'))
    }
  };

  if (environment === 'development') {
    ENV.APP.FB_APP_ID = '523548947807194';
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  ENV.contentSecurityPolicy = {
    'default-src': "'none'",
    'script-src': "'self' www.google-analytics.com connect.facebook.net 'sha256-TZ1d0U/dSrpe8YLo15tVjyV3pS8QTac65pDvOBFh9KI='",
    'child-src': "'self'",
    'font-src': "'self' code.ionicframework.com fonts.gstatic.com",
    'frame-src': "'self' staticxx.facebook.com",
    'connect-src': "'self' sprh.s3.amazonaws.com www.google-analytics.com api-ssl.bitly.com",
    'img-src': "'self' sprh.s3.amazonaws.com s3.amazonaws.com www.google-analytics.com www.facebook.com",
    'style-src': "'self' 'unsafe-inline' code.ionicframework.com cdnjs.cloudflare.com fonts.googleapis.com",
    'media-src': "'self' sprh.s3.amazonaws.com"
  }

  return ENV;
};
