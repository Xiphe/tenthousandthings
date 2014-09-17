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


  /* CONSTANTS */

  /** @const */
  var PATH_RELATIVE_PUBLIC = './public';

  /** @const */
  var PATH_RELATIVE_SRC = './src';

  /** @const */
  var META_FILE_NAME = 'meta.json';

  /** @const */
  var PATH_ROOT = path.join(__dirname, '..');

  module.exports = function(config) {
    var ignoreList = [];
    if (typeof config.ignore === 'object') {
      ignoreList = ignoreList.concat(config.ignore);
    }
    ignoreList = ignoreList.concat([META_FILE_NAME, '**/.DS_Store']);

    var thingName = config.thing || 'things';
    var thingFolder = '_' + thingName;
    ignoreList.push(thingFolder + '.md');

    var src = config.src ?
      path.relative(PATH_ROOT, path.resolve(config.src)) :
      PATH_RELATIVE_SRC;
    var dest = config.dest ?
      path.relative(PATH_ROOT, path.resolve(config.dest)) :
      PATH_RELATIVE_PUBLIC;

    var templates;
    if (config.templates) {
      templates = path.relative(PATH_ROOT, path.resolve(config.templates));
    } else {
      templates = path.join(src, '_templates');
      ignoreList.push('_templates/**');
    }

    /** @const */
    var metaFile = path.join(PATH_ROOT, src, META_FILE_NAME);


    /* SETUP */
    var metadata = {};
    if (fs.existsSync(metaFile)) {
      metadata = require(metaFile);
    }

    var metalsmith = new Metalsmith(PATH_ROOT);


    /* DELEGATION */
    metalsmith
      .source(src)
      .destination(dest)
      .metadata(metadata)
      .use(ignore(ignoreList))
      .use(markdown());

    metalsmith.use(things({
      branch: branch(thingFolder + '/**/*.html'),
      name: thingName
    }));
    metalsmith.use(basicPage({
      branch: branch('*.html'),
      templates: templates
    }));

    return metalsmith;
  };
})();
