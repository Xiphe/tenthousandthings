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
            var postDate = new Date($scope.thing.date);

            $scope.thing.isoDate = postDate.toISOString();
            $scope.thing.date = postDate.getDate() + '.' +
              postDate.getMonth() + '.' + postDate.getFullYear() +
              ' - ' + postDate.getHours() + ':' + postDate.getMinutes();

            $scope.getStyle = function() {
              var background = colorService.stringToColor($scope.thing.categories[0]);
              var border = colorService.stringToColor($scope.thing.categories[0], '2');

              $scope.isLight = colorService.isLight(background);

              return {
                'background-color': '#' + background,
                'border-color': '#' + border
              };
            };
          }
        ]
      };
    }
  ]);
})();
