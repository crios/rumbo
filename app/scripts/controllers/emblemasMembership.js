(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:EmblemasMembershipCtrl
   * @description
   * # EmblemasMembershipCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('EmblemasMembershipCtrl', [ '$rootScope', '$scope', 'PromoService',
      function ($rootScope, $scope, PromoService) {

        var ctrl = this;

        $rootScope.membershipModel = {
          reg: false,
          acr: false,
          pre: false
        };

        ctrl.loadUserMembership = function ($rootScope, id) {
          switch (id) {
            case 1:
              $rootScope.membershipModel.reg = true;
              break;
            case 2:
              $rootScope.membershipModel.acr = true;
              break;
            case 3:
              $rootScope.membershipModel.pre = true;
              break;
          }
          $scope.$emit('membershipModel', {});
        };

        ctrl.notifyMouseEnter = function (reference) {
          if(reference === 'reg'){
            ctrl.tempReg = true;
          }
          else if (reference === 'acr'){
            ctrl.tempAcr = true;
          }
          else if (reference === 'pre'){
            ctrl.tempPre = true;
          }
          $scope.$emit('emblemaMouseEnter', {value: reference});

        };

        ctrl.notifyMouseLeave = function (reference) {
          if(reference === 'reg'){
            ctrl.tempReg = false;
          }
          else if (reference === 'acr'){
            ctrl.tempAcr = false;
          }
          else if (reference === 'pre'){
            ctrl.tempPre = false;
          }
          $scope.$emit('emblemaMouseLeave', {value: reference});

        };

        PromoService.getMembership().then(
          function (response) { ctrl.loadUserMembership($rootScope, response.membershipid);},
          function () {  }
        );

      }]);
})();

