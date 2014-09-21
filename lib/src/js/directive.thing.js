/* global angular */
(function() {
  'use strict';

  angular.module('tenthousandthings').directive('tttThing', [
    'tttColor',
    function(colorService) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          thing: '='
        },
        templateUrl: 'thing.html',
        controller: [
          '$sce', '$scope',
          function($sce, $scope) {

            var background = colorService.stringToColor($scope.thing.categories[0]);
            var border = colorService.stringToColor($scope.thing.categories[0], '2');
            var color = colorService.getContrastColor(background, '111111', 'eeeeee');

            $scope.style = {
              'background-color': '#' + background,
              'border-color': '#' + border,
              color: '#' + color
            };

            $scope.getContent = function() {
              if ($scope.thing.loaded) {
                return $sce.trustAsHtml($scope.thing.content);
              }
            };
          }
        ]
      };
    }
  ]);
})();
