/* global require */
(function() {
  'use strict';

  var Handlebars = require('handlebars');

  /** @const */
  var STYLE_TAG = '<link type="text/css" rel="stylesheet" href=":href"></link>';

  function styleTag(href) {
    return STYLE_TAG.replace(':href', href);
  }

  Handlebars.registerHelper('base-css', function() {
    var css = styleTag('/_src/css/style.css');

    return new Handlebars.SafeString(css);
  });

})();
