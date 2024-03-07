(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:DashboardCtrl
   * @description
   * # FooterCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('DashboardCtrl', ['$rootScope', '$location','FeedService', 'ModalService', 'ProjectService', function ($rootScope, $location, FeedService, ModalService, ProjectService) {

      var ctrl = this;
      ctrl.feeds = [];
      /*
      * Status:
      * 1: Borrador
      * 2: Abierto
      * 3: Asignado
      * 4: Rechazado
      * 5: Cerrado
      */
     /* ctrl.projectList = [{title: 'Algú proyecto de marketing', specialtyId: 2, statusId: 2},
                          {title: 'Modelo 3D de un tanque', specialtyId: 3, statusId: 3},
                          {title: 'Programar una aplicación móvil', specialtyId: 4, statusId: 4},
                          {title: 'Campaña Googles Ads y facebook Ads', specialtyId: 5, statusId: 5},
                          {title: 'Plataforma Para Cliente Corporativos de Hotel con nombre más largo para probar elipsis en desktop', specialtyId: 6, statusId: 1}];*/

      FeedService.getFeeds().then(
        function(response) { ctrl.feeds = response; },
        function() { ctrl.feeds = []; }
      );

      if($location.url() === '/dashboard') {
        ProjectService.getOpenProjectForUser().then(
          function (response) {ctrl.projectList = response; },
          function () { ctrl.projectList = []; }
        );
      }
      else{
        ProjectService.getUserProjects(true).then(
          function(response){ ctrl.projectList = response; },
          function(){ ctrl.projectList = []; }
        );
      }

      ctrl.loadProjectDetails = function (project) {
        $rootScope.changeViewWithSpecElement('projects/'+project.userId + '/' + project.projectId + "/summary");
      };

      ctrl.openProjectUserOffer = function (project) {
        $rootScope.changeViewWithSpecElement('projects/'+project.userId + '/' + project.projectId +"/summary");
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

    }]);
})();
