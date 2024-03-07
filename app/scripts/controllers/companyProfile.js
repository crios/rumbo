(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:CompanyProfileCtrl
   * @description
   * # ProfileCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('CompanyProfileCtrl', [ '$rootScope', '$scope', '$location', '$routeParams', '$q', '$filter', '$timeout', 'ModalService', 'BroadcastService',
      'CompanyProfileService', 'ParameterService', 'UserService', 'ProjectService', 'CountryPickerService',
      function ($rootScope, $scope, $location, $routeParams, $q, $filter, $timeout, ModalService, BroadcastService,
                CompanyProfileService, ParameterService, UserService, ProjectService, CountryPickerService) {

        var ctrl = this;
        // 0 = View and 1 = Edit
        ctrl.modeCompanyInfo= 0;
        ctrl.modeExtract = 0;
        ctrl.modeSideMember = 0;
        ctrl.modeSideFunction = 0;

        /*
        * Status:
        * 1: Borrador
        * 2: Abierto
        * 3: Asignado
        * 4: Rechazado
        * 5: Cerrado
        */
        /*ctrl.projectList = [
          {title: 'Algú proyecto de marketing', specialtyId: 2, statusId: 2},
          {title: 'Modelo 3D de un tanque', specialtyId: 3, statusId: 3},
          {title: 'Programar una aplicación móvil', specialtyId: 4, statusId: 4},
          {title: 'Campaña Googles Ads y facebook Ads', specialtyId: 5, statusId: 5},
          {title: 'Plataforma Para Cliente Corporativos de Hotel con nombre más largo para probar elipsis en desktop', specialtyId: 6, statusId: 1}
        ];*/

        // This needs to be the first evaluation to set the flag for service calls
        if($location.url() === '/profile-company'){
          UserService.isSelfUser = true;
          ctrl.isSelfUser = UserService.isSelfUser;
        }
        else{
          UserService.otherUserId = $routeParams.id;
          UserService.isSelfUser = false;
          ctrl.isSelfUser = UserService.isSelfUser;
          ctrl.isStaffSearch = $routeParams.staffSearch === 'true';
        }
        ctrl.loginType = UserService.loginType;

        function refreshCompanyInfo() {
          CompanyProfileService.getBasicInfo().then(
            function(response){ ctrl.companyInfo = response; },
            function () { ctrl.companyInfo = {}; });
        }

        refreshCompanyInfo();

        ProjectService.getUserProjects(ctrl.isSelfUser).then(
          function(response){ ctrl.projectList = response; },
          function(){ ctrl.projectList = []; }
        );

        // Toggles for view/edit modes - Should be called only in own profile
        ctrl.toggleExtract = function () {
          if(ctrl.modeExtract === 0){
            ctrl.tempExtract = ctrl.companyInfo.extract;
            ctrl.modeExtract = 1;
          }
        };
        
        ctrl.loadProjectDetails = function (project) {
          $rootScope.changeViewWithSpecElement('projects/'+project.userId + '/' + project.projectId + "/summary");
        };
  
        ctrl.editProject = function (project) {
          $rootScope.changeViewWithParams('/project-wizard/summary', {projectId:project.projectId});
        };
  
        ctrl.deleteProject = function (project) {
          ModalService.defaultConfirmation('modals.confirmProjectDelete', true).then(
            function () {
              ProjectService.deleteDefinitely(project).then(
                function () {
                  for(var i = 0; i < ctrl.projectList.length; i++){
                    if(ctrl.projectList[i].projectId === project.projectId){
                      ctrl.projectList.splice(i,1);
                      break;
                    }
                  }
                },
                function () { ModalService.showErrorTryAgain(); }
              );
            }
          );
        };

        ctrl.saveExtract = function () {
          CompanyProfileService.updateExtract(ctrl.tempExtract).then(
            function () {
              ctrl.companyInfo.extract = ctrl.tempExtract;
              ctrl.modeExtract = 0;
            },
            function () { ModalService.showErrorTryAgain(); }
          );
        };

        ctrl.toggleCompanyInfo = function(){
          if(ctrl.modeCompanyInfo === 0){
            ctrl.tempName = ctrl.companyInfo.name !== undefined ? ctrl.companyInfo.name : null;
            ctrl.tempIndustry = ctrl.companyInfo.industry !== undefined ? ctrl.companyInfo.industry : null;
            ctrl.tempCity = ctrl.companyInfo.city !== undefined ? ctrl.companyInfo.city : null;
            ctrl.tempCountry = ctrl.companyInfo.country !== undefined ? ctrl.companyInfo.country : null;
            ctrl.modeCompanyInfo = 1;
          }
        };

        ctrl.saveCompanyInfo = function(){
          console.log('ctrl.tempCountry', ctrl.tempCountry);
          console.log('ctrl.tempCountry despues', CountryPickerService.getCountryCodeFromName(ctrl.tempCountry));
          CompanyProfileService.updateBasicInfo(ctrl.tempName, ctrl.tempIndustry, ctrl.tempCity, CountryPickerService.getCountryCodeFromName(ctrl.tempCountry)).then(
            function(){
              ctrl.companyInfo.name = ctrl.tempName;
              ctrl.companyInfo.industry = ctrl.tempIndustry;
              ctrl.companyInfo.city = ctrl.tempCity;
              ctrl.companyInfo.country = ctrl.tempCountry;
              ctrl.modeCompanyInfo = 0;
            },
            function() { ModalService.showErrorTryAgain(); }
          );
        };

        ctrl.uploadLogo = function () {
          ModalService.showUploadLogo();
        };

        $rootScope.$on('userCompanyLogoUpdated', function () {
          refreshCompanyInfo();
        });

      }]);
})();

