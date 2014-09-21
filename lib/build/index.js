/* global require, module */
(function() {
  'use strict';


  /* MODULES */
  var Metalsmith = require('metalsmith');
  var markdown = require('metalsmith-markdown');
  var ignore = require('metalsmith-ignore');
  var branch = require('metalsmith-branch');
  var things = require('./things');
  var basicPage = require('./basic-page');
  var configurator = require('./configurator');
  var copyAssets = require('./copy-assets');
  var baseJs = require('./handlebars/base-js');

  require('./handlebars/if-greater-than');
  require('./handlebars/base-css');


  /* FACTORY */
  module.exports = function(userConfig) {
    var config = configurator(userConfig);

    baseJs(config);

    /* SETUP */
    var metalsmith = new Metalsmith(config.projectRoot);
    var branches = {
      things: config.thingFolderName + '/**/*.html',
      basicPage: '*.html'
    };

    for (var b in branches) {
      if (b) {
        config.whitelist.push('!' + branches[b]);
      }
    }

    /* DELEGATION */
    metalsmith
      .source(config.src)
      .destination(config.dest)
      .metadata(config.metadata)
      .use(ignore(config.blacklist))
      .use(markdown())
      .use(ignore(config.whitelist))
      .use(function(files, m, done) {
        copyAssets(config, done);
      });

    metalsmith.use(things({
      branch: branch(branches.things),
      name: config.thing,
      pageSize: config.pageSize,
      dest: config.thingsAbs
    }));
    metalsmith.use(basicPage({
      branch: branch(branches.basicPage),
      templates: config.templateFolder
    }));


    return metalsmith;
  };
})();
