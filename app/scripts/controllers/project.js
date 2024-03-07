(function() {

  'use strict';

  angular.module('rombusYeoApp').controller('ProjectCtrl', ['$rootScope', '$routeParams', '$timeout', '$filter','ProjectService', 'ModalService', 'UserService',
    function($rootScope, $routeParams, $timeout, $filter, ProjectService, ModalService, UserService){

      var ctrl = this;
      ctrl.similarProjects = [];
      ctrl.projectSkills = [];

      ctrl.userOffer = {};

      var companyId = $routeParams.companyId;
      var projectId = $routeParams.projectId;
      console.log('UserId',UserService.userId);
      console.log('CompanyId',companyId);
      console.log('ProjectId',projectId);
      ctrl.isSelfUser = UserService.userId.toString() === companyId;
      ctrl.alreadyApplied = false;
      ctrl.showUserOffer = null;

      ProjectService.getProject(projectId).then(
        function(response) {
          console.log('CurrentProject', response);
          ctrl.project = response;
          $timeout(function(){ $rootScope.$broadcast('taExpandable-adjust'); }, 200);
          if(ctrl.isSelfUser !== true && ctrl.project.workerTypeId !== 3 && ctrl.project.workerTypeId !== 4){
            ProjectService.userOfferExists(projectId, UserService.userId).then(
              function (resp) {
                ctrl.showUserOffer = resp.resultOk === false;
                if(ctrl.showUserOffer === false){
                  ctrl.existingUserOffer = resp.userOfferTO;
                }
              },
              function () { ctrl.existingUserOffer = false; ctrl.showUserOffer = true; }
            );
          }
          else{
            ctrl.showUserOffer = false;
          }
          ctrl.userOffer.usd = ctrl.project.userBudget;
        },
        function () { ModalService.showSimpleNotification('Error obteniendo el proyecto'); }
      );



      ctrl.editProject = function () {
        $rootScope.changeViewWithParams('/project-wizard/summary', {projectId:ctrl.project.projectId});
      };

      ctrl.closeProject = function () {
        if(ctrl.isSelfUser){
          $rootScope.changeViewWithSpecElement('/company-dashboard','');
        }
        else{
          //$rootScope.changeViewWithSpecElement('/profile-company/company/'+ctrl.project.userId,'');
          $rootScope.changeViewWithSpecElement('/dashboard','');
        }
      };
      ctrl.userProjectApplication = function () {
        console.log('ctrl.userOffer', ctrl.userOffer);
        ctrl.userOffer.projectId = projectId;
        ProjectService.userOffer(ctrl.userOffer).then(
          function(){
            ModalService.showSimpleNotification('Tu oferta ha sido enviada!');
            $rootScope.changeViewWithSpecElement('/dashboard','');
          },
          function () { ModalService.showErrorTryAgain(); }
        );
      };

      ctrl.checkToBlankOriginalUserOffer = function () {
        if(ctrl.userOffer.usd === ctrl.project.userBudget){
          ctrl.userOffer.usd = null;
        }
      };

    }]);
})();
