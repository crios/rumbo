(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .controller('UserSampleCtrl', [ '$routeParams', 'UserSampleService', 'ModalService',
      function ($routeParams, UserSampleService, ModalService) {

        var ctrl = this;

        ctrl.typeId = 6;
        console.log('Cargamos el id=', ctrl.typeId);

        /*UserSampleService.getSample($routeParams.id).then(
          function(response) { console.log('Procesamos la data'); ctrl.sample = response; },
          function() { ModalService.showErrorTryAgain(); }
        );*/

      }]);
})();
