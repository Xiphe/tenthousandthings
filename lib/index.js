/* global require, __dirname, module */
(function() {
  'use strict';


  /* MODULES */
  var Metalsmith = require('metalsmith');
  var markdown = require('metalsmith-markdown');
  var ignore = require('metalsmith-ignore');
  var branch = require('metalsmith-branch');
  var path = require('path');
  var fs = require('fs');
  var things = require('./things');
  var basicPage = require('./basic-page');


  require('./handlebars/if-greater-than');

  /* CONSTANTS */

  /** @const */
  var PATH_RELATIVE_PUBLIC = './public';

  /** @const */
  var PATH_RELATIVE_SRC = './src';

  /** @const */
  var META_FILE_NAME = 'meta.json';

  /** @const */
  var PATH_ROOT = path.join(__dirname, '..');

  /* FACTORY */
  module.exports = function(config) {
    /* SETUP */
    var templates;
    var metaFile;
    var src;
    var dest;
    var blacklist = [];
    var whitelist = [];
    var metadata = {};
    var metalsmith = new Metalsmith(PATH_ROOT);
    var thingName = config.thing || 'things';
    var thingFolder = '_' + thingName;
    var branches = {
      things: thingFolder + '/**/*.html',
      basicPage: '*.html'
    }


    /* CONFIGURATION */
    if (typeof config.ignore === 'object') {
      blacklist = blacklist.concat(config.ignore);
    }
    blacklist = blacklist.concat([META_FILE_NAME, '**/.DS_Store']);
    blacklist.push(thingFolder + '.md');

    src = config.src ?
      path.relative(PATH_ROOT, path.resolve(config.src)) :
      PATH_RELATIVE_SRC;
    dest = config.dest ?
      path.relative(PATH_ROOT, path.resolve(config.dest)) :
      PATH_RELATIVE_PUBLIC;

    if (config.templates) {
      templates = path.relative(PATH_ROOT, path.resolve(config.templates));
    } else {
      templates = path.join(src, '_templates');
      blacklist.push('_templates/**');
    }

    metaFile = path.join(PATH_ROOT, src, META_FILE_NAME);
    if (fs.existsSync(metaFile)) {
      metadata = require(metaFile);
    }

    if (config.whitelist) {
      whitelist = whitelist.concat(config.whitelist.map(function(thing) {
        return '!' + thing;
      }));
    }

    for (var b in branches) {
      if (b) {
        whitelist.push('!' + branches[b]);
      }
    }

    /* DELEGATION */
    metalsmith
      .source(src)
      .destination(dest)
      .metadata(metadata)
      .use(ignore(blacklist))
      .use(markdown())
      .use(ignore(whitelist));

    metalsmith.use(things({
      branch: branch(branches.things),
      name: thingName
    }));
    metalsmith.use(basicPage({
      branch: branch(branches.basicPage),
      templates: templates
    }));

    return metalsmith;
  };
})();
