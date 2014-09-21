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
          '$sce', '$scope',
          function($sce, $scope) {

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
