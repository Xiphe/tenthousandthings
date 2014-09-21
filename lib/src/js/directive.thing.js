/* global angular */
(function() {
  'use strict';

  angular.module('tenthousandthings').directive('tttThing', [
    function() {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          thing: '='
        },
        templateUrl: 'thing.html',
        controller: [
          function() {
          }
        ]
      };
    }
  ]);
})();
