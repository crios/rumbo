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
    .controller('ContactCtrl', [ 'ContactService', 'ModalService', '$scope',
      function (ContactService, ModalService, $scope) {

      var ctrl = this;

      ctrl.sendEmail = function (mensaje) {

        ContactService.sendMessage(mensaje).then(
          function () {
            ModalService.showSimpleNotification('El mensaje ha sido enviado');
            $scope.mensaje = null;
          },
          function () {
            ModalService.showSimpleNotification('Ha ocurrido un problema durante el envio');
          }
        );
      };

    }]);
})();
