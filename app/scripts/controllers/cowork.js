(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('CoworkCtrl', ['CoworkService', '$location', '$scope', '$rootScope', function (CoworkService, $location, $scope, $rootScope) {

      var ctrl = this;

      $scope.myInterval = 5000;
      $scope.noWrapSlides = false;
      $scope.noPause = true;
      $scope.active = 0;
      $scope.slides = [];

      function processCoworks(data) {
        ctrl.coworks = data;
        var count = 0;
        angular.forEach(data, function (item) {
          if(item.slideUrl !== undefined ) {
            var temp = {};
            temp.id = count;
            temp.coworkId = item.id;
            temp.ref = item.slideUrl;
            temp.title = item.name;
            temp.location = [item.city + ', ' + item.country].filter(function (val) {return val;}).join(', ');
            $scope.slides.push(temp);
            count++;
          }
        });
      }

      CoworkService.getCoworkList().then(
        function (response){ processCoworks(response.data); },
        function () { $rootScope.changeViewWithSpecElement('404',''); }
      );

      ctrl.linkToCowork = function (id) {
        $location.path('/cowork/'+id);
      };

      ctrl.coworkDetails = function () {
        $location.path('/cowork/'+ctrl.coworkSelected.id);
      };

    }]);
})();
