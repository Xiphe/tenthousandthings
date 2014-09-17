/* global require, console */
(function() {
  'use strict';

  require('./lib/index')({thing: 'ideas', src: './example'})
    .build(function(err) {
      if (err) {
        console.error('ERROR: ', err);
      } else {
        console.log('SUCCESS');
      }
    });

})();
