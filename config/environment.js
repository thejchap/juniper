/* jshint node: true */

var fs = require('fs');
var CDN = '//sprh.s3.amazonaws.com';

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'sprh-bulbs',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      CDN_URL: CDN + '/bulbs',
      MEDIA_GROUP: 'stems',
      TEMPO: 164.0,
      BULB_VARIANTS: 3,
      STEMS_BASE_URL: CDN + '/bulbs/audio',
      STEM_FIXTURES: JSON.parse(fs.readFileSync(__dirname + '/stems.json', 'utf8'))
    }
  };

  if (environment === 'development') {
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
    'script-src': "'self'",
    'font-src': "'self'",
    'connect-src': "'self'",
    'img-src': "'self' sprh.s3.amazonaws.com",
    'style-src': "'self' 'unsafe-inline'",
    'child-src': "'self' 'unsafe-inline'",
    'media-src': "'self' sprh.s3.amazonaws.com"
  }

  return ENV;
};