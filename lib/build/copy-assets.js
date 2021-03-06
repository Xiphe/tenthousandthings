/* global require, module */
(function() {
  'use strict';

  var path = require('path');
  var fs = require('fs');
  var ncp = require('ncp');
  var del = require('del');

  module.exports = function copyAssets(config, done) {
    var src = path.join(config.projectRoot, config.dest, '_src');

    fs.exists(config.dest, function(exists) {
      if (exists) {
        del(src, function(err) {
          if (err) { return done(err); }
          copy();
        });
      } else {
        fs.mkdir(config.dest, function(err) {
          if (err) { return done(err); }
          copy();
        });
      }
    });

    function transform(read, write) {
      read.on('end', function(err) {
        if (err) { return err; }
        fs.chmod(write.path, '644');
      }).pipe(write);
    }

    function copy() {
      ncp(
        path.join(config.tenthousandRoot, 'lib/compiled'),
        src,
        {
          transform: transform
        },
        done
      );
    }
  };

})();
