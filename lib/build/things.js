/* global module, require */
(function() {
  'use strict';

  var _ = require('lodash');
  var each = require('./each');

  function titleize(str) {
    str = str.substring(str.lastIndexOf('/') + 1, str.length);
    return str.substring(0, str.lastIndexOf('.'))
      .replace(/[_-]/g, ' ');
  }

  function sortThings(things) {
    things.sort(function(a, b) {
      return a.date - b.date;
    });
  }

  module.exports = function(config) {
    var things = [];
    var bootstrapName = (config.name || 'thing') + 'Bootstrap';

    config.branch.use(each(function getMeta(file, fileName) {
      var meta = {};
      meta.categories = file.categories || [];
      meta.title = file.title || titleize(fileName);
      meta.date = file.date || Date.parse(file.stats.mtime);
      meta.path = '/' + fileName;

      things.push(meta);
    }, function(metalsmith) {
      sortThings(things);

      var meta = {};
      meta[bootstrapName] = '<script type="text/javascript">window.' + bootstrapName + '=' +
          JSON.stringify(things) + ';</script>';

      metalsmith.metadata(_.extend(metalsmith.metadata(), meta));
    }));

    return config.branch;
  };
})();
