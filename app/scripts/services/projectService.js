(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('ProjectService', ['$q', 'BackendService', 'ParameterService', 'UserService', function($q, BackendService, ParameterService,UserService) {

      var service = this;
      service.currentStep = 1;
      service.currentProject = {};
      var statusSorting = [2, 3, 5, 1, 6, 4];
      // publicado, asignado, concluido, borrador, cancelado, rechazado

      function processProject(item){
        ParameterService.getSpecAreaNameFromId(item.specialtyId).then(
          function(spec){ item.specialityName = spec !== undefined ? spec.description : ''; },
          function() { item.specialityName = '';}
        );
        /*if(item.specialtyFunctionId !== null && item.specialtyFunctionId !== undefined){
          ParameterService.getSpecialtyFunctionFromId(item.specialtyFunctionId).then(
            function(specFun) { item.specialtyFunctionDescription = specFun.description; },
            function () { item.specialtyFunctionDescription = ''; }
          );
        }*/
        if(item.projectSkills !== undefined && item.projectSkills !== null){
          angular.forEach(item.projectSkills, function (ps) {
            ParameterService.getSpecAreaNameFromId(ps.specialityid).then(
              function(specArea) { ps.type = specArea !== undefined ? specArea.type : ''; },
              function() {}
            );
          });
        }
      }

      service.getProject = function (projectId) {
        var deferred = $q.defer();
        var data = { projectId: projectId };
        BackendService.standardPost('/project/getProjectDetails', data).then(
          function(response) {
            var item = response;
            response.publicationDate = new Date(response.publicationDate);
              ParameterService.getSpecAreaNameFromId(item.specialtyId).then(
                function(spec){ item.specialityName = spec !== undefined ? spec.description : ''; },
                function() { item.specialityName = '';}
              );
              if(item.specialtyCategoryId !== null && item.specialtyCategoryId !== undefined){
                ParameterService.getSpecialtyCategoryFromId(item.specialtyCategoryId).then(
                  function(specCat) { item.specialtyCategoryDescription = specCat !== undefined ? specCat.description : ''; },
                  function () { item.specialtyCategoryDescription = ''; }
                );
              }
              if(item.specialtySubCategoryId !== null && item.specialtySubCategoryId !== undefined){
                ParameterService.getSpecialtySubCategoryFromId(item.specialtyCategoryId, item.specialtySubCategoryId).then(
                  function(specSub) { item.specialtySubCategoryDescription = specSub !== undefined ? specSub.name : ''; },
                  function () { item.specialtySubCategoryDescription = ''; }
                );
              }
              if(item.projectSkills !== undefined && item.projectSkills !== null){
                angular.forEach(item.projectSkills, function (ps) {
                  ParameterService.getSpecAreaNameFromId(ps.specialityid).then(
                    function(specArea) { ps.type = specArea !== undefined ? specArea.type : ''; },
                    function() {}
                  );
                });
              }
            deferred.resolve(response);
          },
          function () { deferred.reject();}
        );
        return deferred.promise;
      };

      service.getUserProjects = function (isSelfUser) {
        var deferred = $q.defer();
        var data = { 'userId': UserService.getIdForServiceRequest(), 'isSelfUser': isSelfUser };
        BackendService.standardPost('/project/getUserProjects', data).then(
          function(response) {
            angular.forEach(response, function(item){
              processProject(item);
              item.sortValue = statusSorting.indexOf(item.status) +1;
            });
            console.log('LISTA ORDENADA', response);
            deferred.resolve(response);
          },
          function () { deferred.reject();}
        );
        return deferred.promise;
      };

      service.cancelProject = function (project) {
        var deferred = $q.defer();
        BackendService.standardPost('/project/cancel', project).then(
          function(response) { deferred.resolve(response); },
          function () { deferred.reject();}
        );
        return deferred.promise;
      };

      service.deleteDefinitely = function (project) {
        var deferred = $q.defer();
        BackendService.standardPost('/project/deleteDefinitely', project).then(
          function(response) { deferred.resolve(response); },
          function () { deferred.reject();}
        );
        return deferred.promise;
      };

      service.userOffer = function(userOffer){
        var deferred = $q.defer();
        userOffer.userId = UserService.userId;
        console.log('userOffer', userOffer);
        BackendService.standardPost('/project/userOffer', userOffer).then(
          function (response) {
            console.log('KAKAKAAKA', response);
            if(response.resultOk === true){
              deferred.resolve(response);
            }
            else{ deferred.reject(response); }
          },
          function(error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getOpenProjectForUser = function(){
        var deferred = $q.defer();
        var data = { userId: UserService.userId };
        BackendService.standardPost('/project/getOpenProjects', data).then(
          function(response) {
            angular.forEach(response, function(item){
              processProject(item);
            });
            deferred.resolve(response);
          },
          function () { deferred.reject();}
        );
        return deferred.promise;
      };

      service.userOfferExists = function (projectId, userId) {
        var deferred = $q.defer();
        var data = { userId: userId, projectId: projectId };
        BackendService.standardPost('/project/userOfferExists', data).then(
          function(response) {
            deferred.resolve(response);
          },
          function () { deferred.reject();}
        );
        return deferred.promise;
      };

      service.getProjectStats = function (userId) {
        var deferred = $q.defer();
        var data = { userId: userId };
        BackendService.standardPost('/project/getProjectStats', data).then(
          function(response) {
            deferred.resolve(response);
          },
          function () { deferred.reject();}
        );
        return deferred.promise;
      };

    }]);
})();
