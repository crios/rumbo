(function() {

  'use strict';

  angular.module('rombusYeoApp').controller('LoginCtrl', ['$window', '$routeParams', '$rootScope', '$scope', 'LoginService', 'ModalService',
    function($window, $routeParams, $rootScope, $scope, LoginService, ModalService){

    var ctrl = this;
    ctrl.restoreEmailSent = false;
    ctrl.passRestored = LoginService.passRestored;

    ctrl.doLogin = function () {
      LoginService.doNormalLogin(ctrl.email, ctrl.pass, 1).then(
        function (response) {
          LoginService.SetCredentials(1, response.userId, ctrl.email, response.defaultProfile);
          if($routeParams.redirectAfterLogin !== undefined && $routeParams.redirectAfterLogin !== null){
            $rootScope.changeViewWithSpecElement($routeParams.redirectAfterLogin,'');
          }
          else {
            if(response.defaultProfile === '2'){
              $rootScope.changeViewWithSpecElement('company-dashboard','');
            }
            else{
              $rootScope.changeViewWithSpecElement('dashboard', '');
            }
          }
        },
        function (response) {
          if(response.status === 2){
            ModalService.showSimpleNotification("Completa tu registro ingresando al link que te hemos enviado al email registrado!");
          }
          else{
            ModalService.showSimpleNotification('Usuario o contraseña inválidos!');
          }
          ctrl.pass = null;
        }
      );
    };

    ctrl.forgotPass = function () {
      LoginService.forgotPass(ctrl.email).then(
        function () {
          ctrl.restoreEmailSent = true;
          ctrl.email = null;
        },
        function () {
          ModalService.showSimpleNotification('Ha ocurrido un problema y no hemos podido contactarle');
        }
      );
    };

    ctrl.validateResetPwd = function () {
      if(ctrl.newPass !== ctrl.newPass2){
        ModalService.showSimpleNotification('La nueva contraseña no coincide!');
      }
      else {
        LoginService.validateResetPwd($routeParams.mail, $routeParams.hash, ctrl.newPass).then(
          function (response) {
            try{
              if(response.data.resultOk === true){
                LoginService.passRestored = true;
                ctrl.newPass = null;
                ctrl.newPass2 = null;
                $rootScope.changeViewWithSpecElement('login','');
              }
              else{
                if(response.data.description === 'Invalid hash'){
                  ModalService.showSimpleNotification('Link obsoleto! Por favor utilice el link provisto en último mail que le enviamos');
                }
                else{ ModalService.showSimpleNotification(response.data.description); }
              }
            } catch (e) { ModalService.showErrorTryAgain(); }
          },
          function () {
            ModalService.showErrorTryAgain();
          }
        );
      }
    };

    ctrl.linkedInOauth = function () {
      $window.location.href = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=78zxc1hci19t0d&redirect_uri='+config.baseUrl+'/login&state=99ACbr52463D&scope=r_liteprofile%20r_emailaddress';
    };

    if($routeParams.code !== null && $routeParams.code !== undefined){
      ctrl.linkedInCode = $routeParams.code;
      ctrl.state = $routeParams.state;

      // Consume backend
      LoginService.linkedIn(ctrl.linkedInCode, ctrl.state).then(
        function () {
          $rootScope.changeViewWithSpecElement('/dashboard', '');
        },
        function(){
          ModalService.showErrorTryAgain();
        }
      );

      if($routeParams.error !== null && $routeParams.error !== undefined){
        ModalService.showErrorTryAgain();
      }
    }

  }]);
})();
