(function() {

  'use strict';

  angular.module('rombusYeoApp').controller('ModalInstanceCtrl', ['$uibModalInstance', '$scope', 'ModalService', 'SpecAreaService', 'LoginService',
    function($uibModalInstance, $scope, ModalService, SpecAreaService, LoginService){

    var modal = this;
    modal.message = ModalService.message;
    modal.message1 = ModalService.message1;
    modal.message2 = ModalService.message2;
    modal.userEmail = ModalService.userEmail;
    modal.errorMessages = ModalService.errorMessages;
    modal.showCannotUndo = ModalService.showCannotUndo;

    modal.ok = function () {
      $uibModalInstance.close(modal);
    };

    modal.saveSpecAreas = function () {
      SpecAreaService.saveAreas().then(
        function () { modal.ok();},
        function () { }
      );
    };

    modal.reactivateAccount = function () {
      LoginService.forgotPass(modal.userEmail).then(
        function () { modal.ok(); },
        function () { ModalService.showSimpleNotification('Ha ocurrido un problema y no hemos podido contactarle'); }
      );
    };

    modal.confirmApplication = function () {
      $uibModalInstance.close();
    };

    modal.cancel = function () {
      $uibModalInstance.dismiss();
    };

  }]);
})();
