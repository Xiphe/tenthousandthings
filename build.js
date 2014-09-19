/* global require, module */
(function() {
  'use strict';

  var EventEmitter = new require('events').EventEmitter;
  var emitter = new EventEmitter();

  require('./lib/index')(require('./config'))
    .build(function(err) {
      if (err) {
        emitter.emit('error', err);
      } else {
        emitter.emit('success');
      }
    });

  module.exports = emitter;

})();
