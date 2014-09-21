/* global require, process, module */
(function() {
  'use strict';

  var Handlebars = require('handlebars');

  /** @const */
  var SCRIPT_TAG = '<script type="text/javascript" src=":src"></script>\n';

  function scriptTag(src) {
    return SCRIPT_TAG.replace(':src', src);
  }

  module.exports = function() {
    Handlebars.registerHelper('base-js', function() {
      var js =
        scriptTag('/_src/js/vendor.js') +
        scriptTag('/_src/js/scripts.js');

      if (process.env.BASE_JS_INCLUDE_AUTOLOAD) {
        js += scriptTag('//localhost:35729/livereload.js');
      }

      return new Handlebars.SafeString(js);
    });
  };

})();
