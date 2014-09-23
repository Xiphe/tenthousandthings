/* global angular */
(function() {
  'use strict';

  angular.module('tenthousandthings').directive('tttCrazynessSlider', [
    'tttColor',
    function(colorService) {
      return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: 'crazyness-slider.html',
        link: function(scope) {
          var salts = colorService.getSalts();
          var originalSalts = angular.copy(salts);

          scope.crazylevel = 0;

          scope.$watch('crazylevel', function(oldLevelOfCrazyness, newLevelOfCrazyness) {
            if (oldLevelOfCrazyness === newLevelOfCrazyness) {
              return;
            }
            angular.forEach(salts, function(salt, key) {
              salts[key] = originalSalts[key] + newLevelOfCrazyness;
            });
          });
        }
      };
    }
  ]);
})();
