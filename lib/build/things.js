/* global module, require */
(function() {
  'use strict';

  var _ = require('lodash');
  var each = require('./each');
  var fs = require('fs');
  var path = require('path');

  function titleize(str) {
    str = str.substring(str.lastIndexOf('/') + 1, str.length);
    return str.substring(0, str.lastIndexOf('.'))
      .replace(/[_-]/g, ' ');
  }

  function processThings(things, config) {
    var contents = [];
    var page;

    things.sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    }).forEach(function(thing, i) {
      page = Math.floor(i / config.pageSize) + 1;

      if (page > 1) {
        if (!contents[page - 2]) { contents.push({}); }
        contents[page - 2][thing.path] = thing.content;
        delete thing.content;
      } else {
        thing.loaded = true;
      }
      thing.page = page;
    });

    fs.exists(config.dest, function(exists) {
      if (!exists) {
        fs.mkdir(config.dest, function(err) {
          if (err) { return; }
          contents.forEach(function(content, i) {
            var page = i + 2;
            fs.writeFile(
              path.join(config.dest, 'page' + page + '.json'),
              JSON.stringify(content)
            );
          });
        });
      }
    });

    return page;
  }

  module.exports = function(config) {
    var things = [];
    var bootstrapName = (config.name || 'thing') + 'Bootstrap';

    config.branch.use(each(function getMeta(file, fileName) {
      var meta = {};
      meta.categories = file.categories || [];
      meta.title = file.title || titleize(fileName);
      meta.date = Date.parse(file.date || file.stats.mtime);
      meta.path = '/' + fileName;
      meta.content = file.contents.toString();

      things.push(meta);

      return false;
    }, function(metalsmith) {
      var pages = processThings(things, config);
      var meta = {};

      meta[bootstrapName] = '<script type="text/javascript">window.ttt=' +
          JSON.stringify({
            colorSalt: config.colorSalt,
            colorSalt2: config.colorSalt2,
            initial: things,
            pages: pages,
            page: 1
          }) +
          ';</script>';

      metalsmith.metadata(_.extend(metalsmith.metadata(), meta));
    }));

    return config.branch;
  };
})();
