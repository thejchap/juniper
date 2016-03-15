/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  app.import('vendor/modernizr-custom.js');
  app.import(app.bowerDirectory + '/bootstrap/js/transition.js');
  app.import(app.bowerDirectory + '/bootstrap/js/modal.js');
  app.import(app.bowerDirectory + '/bootstrap/js/tooltip.js');
  app.import(app.bowerDirectory + '/jquery-knob/dist/jquery.knob.min.js');
  app.import(app.bowerDirectory + '/tether-shepherd/dist/css/shepherd-theme-arrows-plain-buttons.css');
  app.import(app.bowerDirectory + '/tether-shepherd/dist/css/shepherd-theme-arrows.css');
  app.import(app.bowerDirectory + '/tether-shepherd/dist/css/shepherd-theme-dark.css');
  app.import(app.bowerDirectory + '/tether-shepherd/dist/css/shepherd-theme-default.css');
  app.import(app.bowerDirectory + '/tether-shepherd/dist/css/shepherd-theme-square-dark.css');
  app.import(app.bowerDirectory + '/tether-shepherd/dist/css/shepherd-theme-square.css');

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
