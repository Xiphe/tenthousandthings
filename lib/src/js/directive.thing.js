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
            var postDate = new Date($scope.thing.date);

            $scope.isLight = colorService.isLight(background);

            $scope.thing.isoDate = postDate.toISOString();
            $scope.thing.date = postDate.getDate() + '.' +
              postDate.getMonth() + '.' + postDate.getFullYear() +
              ' - ' + postDate.getHours() + ':' + postDate.getMinutes();

            $scope.style = {
              'background-color': '#' + background,
              'border-color': '#' + border
            };
          }
        ]
      };
    }
  ]);
})();
