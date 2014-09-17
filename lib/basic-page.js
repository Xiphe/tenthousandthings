/* global module, require */
(function() {
  'use strict';

  /** @const */
  var DEFAULT_TEMPLATE = 'page.html';

  var _ = require('lodash');
  var templates = require('metalsmith-templates');
  var permalinks = require('metalsmith-permalinks');
  var each = require('./each');

  function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
  }

  module.exports = function(config) {
    var navigation = [];

    config.branch
      .use(each(function name(file, fileName) {
        if (!file.name) {
          file.name = fileName.substring(0, fileName.lastIndexOf('.'));
          if (file.name === 'index') {
            delete file.name;
          }
        }
      }))
      .use(each(function defaultTemplate(file) {
        if (!file.template) {
          file.template = DEFAULT_TEMPLATE;
        }
      }))
      .use(permalinks({pattern: ':name'}))
      .use(each(function navigationBuilder(file) {
        var navItem = {};

        if (file['nav-title'] || file.name) {
          navItem.title = file['nav-title'] || ucfirst(file.name);
        } else {
          return;
        }

        if (file['nav-order']) {
          navItem.order = file['nav-order'];
        }

        navItem.path = '/' + file.path;

        navigation.push(navItem);
      }, function(metalsmith) {
        navigation.sort(function(a, b) {
          if (a.order === b.order) {
            if (a.title > b.title) {
              return 1;
            } else if (a.title < b.title) {
              return -1;
            }
            return 0;
          } else if (typeof a.order === 'undefined') {
            return 1;
          } else if (typeof b.order === 'undefined') {
            return -1;
          } else {
            return a.order - b.order;
          }
        });

        metalsmith.metadata(_.extend(metalsmith.metadata(), {
          basicNavigation: navigation
        }));
      }))
      .use(templates({
        engine: 'handlebars',
        directory: config.templates
      }));

    return config.branch;
  };

})();
