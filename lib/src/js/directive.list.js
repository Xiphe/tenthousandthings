/* global angular */
(function() {
  'use strict';

  /** @const */
  var PAGE_URL = '/_things/page:page.json';

  angular.module('tenthousandthings').directive('tttList', [
    '$http', '$q', 'tttColor',
    function($http, $q, colorService) {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'list.html',
        controller: [
          '$scope',
          function($scope) {
            var ttt = window.ttt;
            var page = ttt.page || 1;
            var pages = ttt.pages || 1;
            delete window.ttt;

            colorService.setSalt(ttt.colorSalt);
            colorService.setSalt(ttt.colorSalt2, '2');

            function hasPages() {
              return pages > page;
            }

            function loadPage(i) {
              var d = $q.defer();
              var pageUrl = PAGE_URL.replace(':page', i);
              $http.get(pageUrl).then(function(result) {
                d.resolve(result.data);
              }, d.reject);

              return d.promise;
            }

            function applyPageContents(contents) {
              $scope.things.forEach(function(thing) {
                if (thing.loaded) { return; }
                if (!angular.isUndefined(contents[thing.path])) {
                  thing.content = contents[thing.path];
                  thing.loaded = true;
                }
              });
            }

            $scope.things = ttt.initial || [];
            $scope.hasPages = hasPages();

            $scope.scroll = function() {
              if ($scope.hasPages) {
                $scope.hasPages = false;
                $q.when(loadPage(page + 1))
                  .then(applyPageContents)
                  .then(function() {
                    page += 1;
                    $scope.hasPages = hasPages();
                  });
              }
            };
          }
        ]
      };
    }
  ]);
})();
