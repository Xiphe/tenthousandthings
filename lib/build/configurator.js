/* global require, __dirname, module */
(function() {
  'use strict';

  var path = require('path');
  var fs = require('fs');

  /* CONSTANTS */

  /** @const */
  var DEFAULT_PATH_DEST = './public';

  /** @const */
  var DEFAULT_PATH_SRC = './src';

  /** @const */
  var DEFAULT_THING_NAME = 'things';

  /** @const */
  var DEFAULT_TEMPLATE_FOLDER = '_templates';

  /** @const */
  var META_FILE_NAME = 'meta.json';

  /** @const */
  var PATH_ROOT = path.join(__dirname, '../..');


  module.exports = function configurator(userConfig) {
    if (userConfig.__configurated) {
      return userConfig;
    }

    var metaFile;
    var thing = userConfig.thing || DEFAULT_THING_NAME;
    var thingFolderName = '_' + thing;
    var templateFolder = userConfig.templates || DEFAULT_TEMPLATE_FOLDER;
    var metaFileName = userConfig.metaFile || META_FILE_NAME;

    var config = {
      rootPath: PATH_ROOT,
      blacklist: [META_FILE_NAME, '**/.DS_Store', thingFolderName + '.md'],
      whitelist: ['*.+(jpeg|jpg|png|gif|svg)'],
      thing: thing,
      thingFolderName: thingFolderName,
      __configurated: true
    };

    if (typeof userConfig.ignore === 'object') {
      config.blacklist = config.blacklist.concat(userConfig.ignore);
    }

    if (userConfig.whitelist) {
      config.whitelist = config.whitelist.concat(
        userConfig.whitelist.map(function(thing) {
          return '!' + thing;
        })
      );
    }

    if (userConfig.src) {
      config.src = path.relative(PATH_ROOT, path.resolve(userConfig.src));
    } else {
      config.src = DEFAULT_PATH_SRC;
    }

    if (userConfig.dest) {
      config.dest = path.relative(PATH_ROOT, path.resolve(userConfig.dest));
    } else {
      config.dest = DEFAULT_PATH_DEST;
    }

    config.templateFolder = path.relative(
      PATH_ROOT,
      path.join(PATH_ROOT, config.src, templateFolder)
    );

    metaFile = path.join(PATH_ROOT, config.src, metaFileName);
    if (fs.existsSync(metaFile)) {
      config.metadata = require(metaFile);
    }

    return config;
  };

})();