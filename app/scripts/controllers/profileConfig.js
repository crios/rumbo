(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:ProfileConfigCtrl
   * @description
   * # ProfileConfigCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('ProfileConfigCtrl', [ '$rootScope', '$q','$filter','SpecAreaService', 'ProfileService','LoginService', 'UserService', 'ModalService', 'AwsS3Service', 'BroadcastService', 'CountryPickerService',
      function ($rootScope, $q,$filter,SpecAreaService, ProfileService, LoginService, UserService, ModalService, AwsS3Service ,BroadcastService, CountryPickerService) {

      var ctrl = this;
      // 0 = View and 1 = Edit
      ctrl.modeMain = 0;
      ctrl.modeEmailPass = 0;
      ctrl.modePhoneAddress = 0;
      ctrl.modePlan = 0;
      ctrl.modeSpecAreas = 0;

      ctrl.isUpdatingPassword = false;
      ctrl.showUpdatedMessage = false;

      ctrl.profilePreferenceList = [{id:1, name:'Profesional'},{id:2,name:'Empresa'}];

      // This needs to be the first evaluation to set the flag for service calls
      UserService.isSelfUser = true;
      ctrl.profilePreference = $filter('filter')(ctrl.profilePreferenceList, {id:UserService.profilePreference})[0];
      ctrl.isCompanyView = UserService.profilePreference === '2';

      function processBasicInfo(basicInfo) {
        ctrl.firstName = basicInfo.name;
        ctrl.lastName = basicInfo.surname;
        ctrl.jobTitle = basicInfo.specialityDescr;
        ctrl.location = basicInfo.location;
        ctrl.country = CountryPickerService.getCountryNameFromCode(basicInfo.country);
        ctrl.memberSince = new Date(basicInfo.memberSince);
        ctrl.phone = basicInfo.cellphone;
        ctrl.address = basicInfo.address;
        ctrl.companyJobTitle = basicInfo.companyJobTitle;
      }

      function blankBasicInfo() {
        ctrl.firstName = undefined;
        ctrl.lastName = undefined;
        ctrl.jobTitle = undefined;
        ctrl.location = undefined;
        ctrl.country = undefined;
        ctrl.memberSince = undefined;
        ctrl.phone = undefined;
        ctrl.address = undefined;
      }

      function copyMainToTemps() {
        ctrl.tempFirstName = ctrl.firstName;
        ctrl.tempLastName = ctrl.lastName;
        ctrl.tempJobTitle = ctrl.jobTitle;
        ctrl.tempLocation = ctrl.location;
        ctrl.tempCountry = ctrl.country;
        ctrl.tempProfilePreference = ctrl.profilePreference;
      }

      function setViewMode() {
        ctrl.modeMain = 0;
        ctrl.modeEmailPass = 0;
        ctrl.modePhoneAddress = 0;
        ctrl.modePlan = 0;
        ctrl.isUpdatingPassword = false;
        ctrl.modeSpecAreas = 0;
      }

      $q.all([
        AwsS3Service.getProfilePicture(true),
        ProfileService.getBasicInfo(),
        ProfileService.getEmail()
      ]).then(
          function (values) {
            ctrl.userPicture = values[0];
            processBasicInfo(values[1]);
            ctrl.email = values[2].email;
          },
          function () {
            ctrl.userPicture = null;
            blankBasicInfo();
            ctrl.email = undefined;
          }
      );

      // Toggles for view/edit modes
      ctrl.toggleMain = function () {
        if(ctrl.modeMain === 0){
          copyMainToTemps();
          ctrl.modeMain = 1;
        }
      };

      ctrl.toggleUpdatePassword = function () {
        ctrl.isUpdatingPassword = true;
      };

      ctrl.toggleEmailPass = function () {
        if(ctrl.modeEmailPass === 0){
          ctrl.modeEmailPass = 1;
          ctrl.tempEmail = ctrl.email;
        }
      };

      ctrl.togglePhoneAddress = function () {
        if(ctrl.modePhoneAddress === 0){
          ctrl.modePhoneAddress = 1;
          ctrl.tempPhone = ctrl.phone;
          ctrl.tempAddress = ctrl.address;
        }
      };

      ctrl.togglePlan = function () {
        if(ctrl.modePlan === 0){
          ctrl.modePlan = 1;
        }
        else{
          ctrl.modePlan = 0;
        }
      };

      ctrl.updatePass = function () {
        if(ctrl.pass === ctrl.newPass){
          ModalService.showSimpleNotification('La nueva contraseña debe ser diferente de la existente!');
        }
        else if(ctrl.newPass !== ctrl.newPass2){
          ModalService.showSimpleNotification('La nueva contraseña no coincide!');
        }
        else {
          LoginService.updatePass(UserService.email, ctrl.pass, ctrl.newPass).then(
            function () {
              ctrl.isUpdatingPassword = false;
              ctrl.showUpdatedMessage = true;
              ctrl.pass = null;
              ctrl.newPass = null;
              ctrl.newPass2 = null;
              /*$rootScope.changeViewWithSpecElement('/profile/config','');*/
            },
            function () {
              ModalService.showSimpleNotification('Ha ocurrido un problema, por favor intente nuevamente.');
            }
          );
        }
      };

      ctrl.closeUpdateForm = function () {
        ctrl.pass = null;
        ctrl.newPass = null;
        ctrl.newPass2 = null;
        ctrl.isUpdatingPassword = false;
        ctrl.showUpdatedMessage = false;
      };

      ctrl.toggleSpecAreas = function () {
        if(ctrl.modeSpecAreas === 0){ ctrl.modeSpecAreas = 1; }
      };

      ctrl.confirmChanges = function () {
        if(ctrl.modeMain === 0){ copyMainToTemps(); }
        if(ctrl.modeEmailPass === 0) { ctrl.tempEmail = ctrl.email; }
        if(ctrl.modePhoneAddress === 0) { ctrl.tempPhone = ctrl.phone; ctrl.tempAddress = ctrl.address; }
        // Company profile preference
        if(ctrl.tempProfilePreference.id === 2) {
          $q.all([
            ProfileService.updateBasicInfo(ctrl.tempFirstName, ctrl.tempLastName, ctrl.tempJobTitle, ctrl.tempLocation,
              CountryPickerService.getCountryCodeFromName(ctrl.tempCountry), ctrl.tempPhone, ctrl.tempAddress, ctrl.companyJobTitle),
            ProfileService.updateEmail(ctrl.tempEmail),
            UserService.setProfileCompany()
          ]).then(
            function () { LoginService.updateDefaultProfileInCookie('2'); $rootScope.changeViewWithSpecElement('profile-company',''); },
            function () { ModalService.showSimpleNotification('Se ha producido un error, por favor intente nuevamente'); }
          );
        }
        // Professional profile preference
        else{
          $q.all([
            ProfileService.updateBasicInfo(ctrl.tempFirstName, ctrl.tempLastName, ctrl.tempJobTitle, ctrl.tempLocation,
              CountryPickerService.getCountryCodeFromName(ctrl.tempCountry), ctrl.tempPhone, ctrl.tempAddress, ctrl.companyJobTitle),
            ProfileService.updateEmail(ctrl.tempEmail),
            SpecAreaService.saveAreas(),
            UserService.setProfileProfessional()
          ]).then(
            function () { LoginService.updateDefaultProfileInCookie('1'); $rootScope.changeViewWithSpecElement('profile',''); },
            function () { ModalService.showSimpleNotification('Se ha producido un error, por favor intente nuevamente'); }
          );
        }
      };

      ctrl.cancelEdit = function () {
        setViewMode();
        BroadcastService.rootScopeBroadcast('profileEditionCancelled', {});
        if(ctrl.isCompanyView === true){
          $rootScope.changeViewWithSpecElement('profile-company','');
        }
        else{
          $rootScope.changeViewWithSpecElement('profile','');
        }
      };

      ctrl.closeAccount = function () {
        ProfileService.closeAccount().then(
          function() { UserService.logoutUser(); $rootScope.changeViewWithSpecElement('','');},
          function() { }
        );
      };

    }]);
})();


