/* global module */
(function() {
  'use strict';

  module.exports = function each(callback, beforeDone) {
    return function(files, m, done) {
      for (var filename in files) {
        if (filename) {
          if (callback(files[filename], filename) === false) {
            delete files[filename];
          }
        }
      }
      if (typeof beforeDone === 'function') {
        beforeDone(m);
      }
      done();
    };
  };

})();