(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:StaffCtrl
   * @description
   * # StaffCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('StaffCtrl', ['CountryPickerService', 'ParameterService', 'StaffService', 'ModalService', 'UserService', '$rootScope', '$timeout', '$filter', '$q', '$routeParams', '$location',
      function (CountryPickerService, ParameterService, StaffService, ModalService, UserService, $rootScope, $timeout, $filter, $q, $routeParams, $location) {

      var ctrl = this;

      ctrl.gridCounter = 1;

      function getMembershipIcon(id) {
        switch (id) {
          case 1: return '../../images/m-registrado.svg';
          case 2: return '../../images/m-acreditado.svg';
          case 3: return '../../images/m-premium.svg';
          default: return '';
        }
      }

      function processOneGridUser (data, item) {
        item.membershipName = data.description;
        item.membershipIcon = getMembershipIcon(item.membershipId);
      }

      function processGridUsers(data) {
        angular.forEach(data, function (item) {
          ParameterService.getUserMembershipsById(item.membershipId).then(
            function (resp) { processOneGridUser(resp, item); }
          );
        });
        return data;
      }

      function blankValue() {
        ctrl.showSpinner = true;
        ctrl.resultadoBusqueda = [];
        ctrl.specAreaSelected = null;
        ctrl.skillSelected = null;
        ctrl.countrySelected = null;
        ctrl.ctrl.gridCounter = 1;
      }

      // Initialize
        if($routeParams.currentSearch !== 'true'){
          $q.all([
            ParameterService.getSkills(),
            ParameterService.getSpecAreas(),
            StaffService.getDefaultGridUsers(ctrl.gridCounter)
          ]).then(
            function(values) {
              ctrl.skillList = values[0];
              ctrl.specAreaList = values[1];
              ctrl.resultadoBusqueda = processGridUsers(values[2]);
            },
            function() { ModalService.showErrorTryAgain(); }
          );
        }
        else{
          $location.search('currentSearch', null);
          $q.all([
            ParameterService.getSkills(),
            ParameterService.getSpecAreas(),
            StaffService.getCurrentSearchResults()
          ]).then(
            function(values) {
              ctrl.skillList = values[0];
              ctrl.specAreaList = values[1];
              ctrl.resultadoBusqueda = processGridUsers(values[2]);
            },
            function() { ModalService.showErrorTryAgain(); }
          );
        }

      ctrl.defaultGrid = function () {
        blankValue();
        StaffService.getDefaultGridUsers(ctrl.gridCounter).then(
          function(response) {
            ctrl.resultadoBusqueda = processGridUsers(response);
            ctrl.showSpinner = false;
            ctrl.gridCounter++;
          },
          function () { ModalService.showErrorTryAgain(); ctrl.showSpinner = false;}
        );
      };

      ctrl.buscar = function () {
        ctrl.showSpinner = true;
        var specAreaId = angular.isDefined(ctrl.specAreaSelected) && ctrl.specAreaSelected !== null ? ctrl.specAreaSelected.id  : null;
        var skillId = angular.isDefined(ctrl.skillSelected) && ctrl.skillSelected !== null ? ctrl.skillSelected.id : null;
        var country = angular.isDefined(ctrl.countrySelected) && ctrl.countrySelected !== null ? CountryPickerService.getCountryCodeFromName(ctrl.countrySelected) : null;
        var fullName = angular.isDefined(ctrl.nameSelected) && ctrl.nameSelected !== null && ctrl.nameSelected.length > 0 ? ctrl.nameSelected : null;
        if(specAreaId !== null || skillId !== null || country !== null || fullName !== null) {
          StaffService.findUsers(specAreaId, skillId, country, fullName).then(
            function (response) { ctrl.resultadoBusqueda = processGridUsers(response); ctrl.showSpinner = false;},
            function () { ModalService.showErrorTryAgain(); ctrl.showSpinner = false;}
          );
        }
        else {
          ModalService.showSimpleNotification('Debe seleccionar al menos una especialidad o habilidad para realizar la busqueda');
          ctrl.showSpinner = false;
        }
      };

      ctrl.getMoreUsers = function () {
        ctrl.showSpinner = true;
        ctrl.gridCounter++;
        console.log('GridCounter=', ctrl.gridCounter);
        StaffService.getDefaultGridUsers(ctrl.gridCounter).then(
          function(response) {
            response = $filter('orderBy')(response, 'urlProfilePicture');
            angular.forEach(response, function (item) {
              ParameterService.getUserMembershipsById(item.membershipId).then(
                function (resp) { processOneGridUser(resp, item); }
              );
              ctrl.resultadoBusqueda.push(item);
            });
            ctrl.showSpinner = false;
          },
          function () { ModalService.showErrorTryAgain(); ctrl.showSpinner = false;}
        );
      };

      ctrl.showUser = function(user, closeButton) {
        $('#'+closeButton).click();
        $timeout(function(){
          if(user.userId === UserService.userId ){
            $rootScope.changeViewWithSpecElement('profile','');
          }
          else{
            $rootScope.changeViewWithParams('profile/users/'+user.userId, {staffSearch: 'true'});
          }
        }, 250);
      };

      ctrl.setActiveUserForModal = function(user){
        user.country = CountryPickerService.getCountryNameFromCode(user.country);
        ctrl.modaUser = user;
        angular.element('#user_modal').show();
      };

      ctrl.closeUserModal = function() {
        ctrl.modaUser = null;
        angular.element('#user_modal').show();
      };

      ctrl.notifyUserTryingToContact = function (user) {
        StaffService.sendUserContactNotification(user.userId).then(
          function(){ ctrl.modaUser.notified = true; },
          function(){ console.log('Error intentando contactar al usuario para que complete el perfil');}
        );
      };

    }]);
})();
