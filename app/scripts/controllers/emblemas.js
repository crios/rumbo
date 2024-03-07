(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:EmblemasCtrl
   * @description
   * # EmblemasCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('EmblemasCtrl', [ '$rootScope', '$scope', function ($rootScope, $scope) {

      var ctrl = this;

      $scope.$on('membershipModel', function () {
        if(angular.isDefined($rootScope.membershipModel)){
          if($rootScope.membershipModel.reg === true){
            ctrl.titleMessage = 'ESTA ES TU ACTUAL MEMBRESIA';
            ctrl.statusMessage = '¡Estás en el Plan Inicio, si quieres mejorar tu condición, cliquea en emblemas!';
            ctrl.tempStyle = 'reg';
          }
          else if ($rootScope.membershipModel.acr === true){
            ctrl.titleMessage = 'ESTA ES TU ACTUAL MEMBRESIA';
            ctrl.statusMessage = '¡Estás en el Plan Standard, si quieres mejorar tu condición, cliquea en emblemas!';
            ctrl.tempStyle = 'acr';
          }
          else if($rootScope.membershipModel.pre === true) {
            ctrl.titleMessage = 'ESTA ES TU ACTUAL MEMBRESIA';
            ctrl.statusMessage = '¡Estás en el Plan Premium, si quieres mejorar tu condición, cliquea en emblemas!';
            ctrl.tempStyle = 'pre';
          }
        }
      });

      $scope.$on('emblemaMouseEnter', function (event, data) {
        ctrl.titleMessageBK = ctrl.titleMessage;
        ctrl.statusMessageBK = ctrl.statusMessage;
        ctrl.tempStyleBK = ctrl.tempStyle;
        ctrl.tempStyle = data.value;
        switch (data.value) {
          case 'reg':
            ctrl.titleMessage = 'MIEMBRO REGISTRADO';
            ctrl.statusMessage = '¡Plan Inicio, el primer gran paso!';
            break;
          case 'acr':
            ctrl.titleMessage = 'MIEMBRO ACREDITADO';
            ctrl.statusMessage = '¡Permite figurar en el Staff y tener mayores capacidades!';
            break;
          case 'pre':
            ctrl.titleMessage = 'MIEMBRO PREMIUM';
            ctrl.statusMessage = '¡Accede al Plan Full y obtendrás los mayores beneficios!';
            break;
          case 'sc':
            ctrl.titleMessage = 'STAFF CORPORATIVO';
            ctrl.statusMessage = '¡La máxima calificación para proyectos de alta demanda!';
            break;
          case 'pm':
            ctrl.titleMessage = 'PROJECT MANAGER';
            ctrl.statusMessage = '¡Postúlate para coordinar equipos, cuentas y proyectos!';
            break;
          case 'co':
            ctrl.titleMessage = 'COWORKER';
            ctrl.statusMessage = '¡Aprovecha los descuentos en nuestra red de coworking!';
            break;
          case 're':
            ctrl.titleMessage = 'REPRESENTANTE';
            ctrl.statusMessage = '¡Conviértete en un referente destacado de Rombus!';
            break;
          default:
            ctrl.titleMessage = '';
            ctrl.statusMessage = '';
        }
      });

      $scope.$on('emblemaMouseLeave', function () {
        ctrl.titleMessage = ctrl.titleMessageBK;
        ctrl.statusMessage = ctrl.statusMessageBK;
        ctrl.tempStyle = ctrl.tempStyleBK;
      });

    }]);
})();

