/* global module */
(function() {
  'use strict';

  module.exports = function each(callback, beforeDone) {
    return function(files, m, done) {
      for (var filename in files) {
        if (filename) {
          callback(files[filename], filename);
        }
      }
      if (typeof beforeDone === 'function') {
        beforeDone(m);
      }
      done();
    };
  };

})();