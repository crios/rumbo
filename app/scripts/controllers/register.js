(function() {

  'use strict';

  angular.module('rombusYeoApp').controller('RegisterCtrl', ['$location', '$rootScope', '$q',
    '$scope', 'RegisterService', 'ModalService', 'SkillService', 'SpecAreaService', 'UserService',
    function($location, $rootScope, $q, $scope, RegisterService, ModalService, SkillService,
             SpecAreaService, UserService){

      var ctrl = this;
      ctrl.tempEmail = UserService.email;

      // Check if we are confirming an account and perform it
      if($location.path() === '/register/confirmation'){
        var params = $location.search();
        if(angular.isDefined(params.mail) && angular.isDefined(params.hash)){
          RegisterService.confirmRegistration(params.mail, params.hash).then(
            function (response) {
              ctrl.confirmationError = false;
              UserService.loginUser(1, response.userId, params.mail, response.defaultProfile);
              console.log('CONFIRM RESP', response);
              if(response.defaultProfile === '2'){ $rootScope.changeViewWithSpecElement('/company-dashboard',''); }
              else{ $rootScope.changeViewWithSpecElement('register/welcome'); }
            },
            function () { ctrl.confirmationError = true; }
          );
        }
        else{ ctrl.confirmationError = true; }
      }else{
        $location.search({});
      }

      ctrl.registration = function (profile) {
        if(profile.email === profile.email2){
          if(profile.pass === profile.pass2){
            RegisterService.register(profile).then(
              function (response) {
                UserService.expressTransientLogin(profile.email, response.userId);
                $rootScope.changeViewWithSpecElement('register/emailSent','');
              },
              function () { ModalService.showErrorTryAgain(); }
            );
          }
          else{
            ModalService.showSimpleNotification('La contraseña no coincide');
          }
        }
        else {
          ModalService.showSimpleNotification('El email no coincide');
        }

      };

      ctrl.resendRegistrationEmail = function () {
        RegisterService.resendRegistrationEmail(ctrl.tempEmail).then(
          function () {
            ModalService.showSimpleNotification('Hemos reenviado el mensaje de confirmación de registro');
          },
          function () { ModalService.showErrorTryAgain(); }
        );
      };

      ctrl.saveChanges = function () {
        if(SpecAreaService.spec1 === null && SpecAreaService.spec2 === null){
          ModalService.showSimpleNotification('Debes seleccionar al menos un área de especialidad!');
        }
        else{
          $q.all([
            SpecAreaService.saveAreas(),
            SkillService.saveSkills()
          ]).then(
            function () { $rootScope.changeViewWithSpecElement('dashboard',''); },
            function(){ ModalService.showErrorTryAgain(); }
          );
        }
      };

      ctrl.setProfilePreference = function (pref) {

        if(pref === 'company'){
          UserService.setProfileCompany().then(
            function(){ $rootScope.changeViewWithSpecElement('/company-dashboard',''); },
            function(){ ModalService.showErrorTryAgain(); }
          );
        }
        else{
          UserService.setProfileProfessional().then(
            function(){ $rootScope.changeViewWithSpecElement('register/welcome-professional','');}, //register/welcome-professional/
            function(){ ModalService.showErrorTryAgain(); }
          );
        }
      };

      ctrl.createProject = function () {
        UserService.setProfileCompany().then(
          function(){ $rootScope.changeViewWithSpecElement('/project-wizard/step1',''); },
          function(){ ModalService.showErrorTryAgain(); }
        );
      };

    }]);
})();
