(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:EmblemasFuncionCtrl
   * @description
   * # EmblemasFuncionCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('EmblemasFuncionCtrl', [ '$rootScope', '$scope', 'PromoService',
      function ($rootScope, $scope, PromoService) {

        var ctrl = this;

        $rootScope.functionsModel = {
          sc: false,
          pm: false,
          co: false,
          re: false
        };

        ctrl.loadUserFunction = function ($rootScope, sa) {
          switch (sa) {
            case 1:
              $rootScope.functionsModel.sc = true;
              break;
            case 2:
              $rootScope.functionsModel.pm = true;
              break;
            case 3:
              $rootScope.functionsModel.co = true;
              break;
            case 4:
              $rootScope.functionsModel.re = true;
              break;
          }
        };

        ctrl.notifyMouseEnter = function (reference) {
          if(reference === 'sc'){
            ctrl.tempSc = true;
          }
          else if (reference === 'pm'){
            ctrl.tempPm = true;
          }
          else if (reference === 'co'){
            ctrl.tempCo = true;
          }
          else if (reference === 're'){
            ctrl.tempRe = true;
          }
          $scope.$emit('emblemaMouseEnter', {value: reference});

        };

        ctrl.notifyMouseLeave = function (reference) {
          if(reference === 'sc'){
            ctrl.tempSc = false;
          }
          else if (reference === 'pm'){
            ctrl.tempPm = false;
          }
          else if (reference === 'co'){
            ctrl.tempCo = false;
          }
          else if (reference === 're'){
            ctrl.tempRe = false;
          }
          $scope.$emit('emblemaMouseLeave', {value: reference});
        };

        PromoService.getUserFunction().then(
          function (response) { ctrl.loadUserFunction($rootScope, response.functionid); },
          function () { }
        );

      }]);
})();

