(function() {
  'use strict';

  angular.module('tenthousandthings').directive('tttList', [
    function(
    ) {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'list.html'
      }
    }
  ]);
})();
