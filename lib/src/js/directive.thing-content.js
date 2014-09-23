/* global angular */
(function() {
  'use strict';

  angular.module('tenthousandthings').directive('tttThingContent', [
    '$compile',
    function($compile) {
      return {
        restrict: 'C',
        link: function(scope, element) {
          var content = scope.thing.content;

          if (scope.thing.compile) {
            content = $compile(content)(scope);
          }

          element.append(content);
        }
      };
    }
  ]);
})();
