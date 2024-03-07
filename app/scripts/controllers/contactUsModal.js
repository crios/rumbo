(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:MainCtrl
   * @description
   * # ContactCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('ContactUsCtrl', [ 'UserService', 'ContactService', 'ModalService', 'CountryPickerService', '$scope', '$uibModalInstance',
      function (UserService, ContactService, ModalService, CountryPickerService, $scope, $uibModalInstance) {

        var ctrl = this;

        ctrl.ok = function () {
          $uibModalInstance.close(ctrl);
        };

        ctrl.sendEmail = function (mensaje) {
          ContactService.sendMessage(mensaje).then(
           function () { ctrl.ok(); },
           function () { ModalService.showErrorTryAgain(); }
          );
        };

        if(ModalService.contactModalRequested === true){
          $scope.mensaje = {};
          if(ModalService.contactOption !== null){
            $scope.shouldChangeReason = false;
            $scope.mensaje.reason = ModalService.contactOption;
          }
          else{
            $scope.shouldChangeReason = true;
          }

          if(UserService.isLogged === true){
            $scope.mensaje.email = UserService.email;
            if(UserService.basicInfo !== null){
              try{
                $scope.mensaje.fullName = UserService.basicInfo.fullName;
                var country = CountryPickerService.getCountryNameFromCode(UserService.basicInfo.country);
                $scope.mensaje.location = [UserService.basicInfo.location, country].filter(function (val) {return val;}).join(', ');
              } catch(err) {}
            }
          }
        }

      }]);
})();
