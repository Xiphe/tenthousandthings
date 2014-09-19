/* global require */
(function() {
  'use strict';

  var Handlebars = require('handlebars');

  Handlebars.registerHelper('if-greater-than', function(a, b, opts) {
    if (a > b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });

})();
