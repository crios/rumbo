(function() {
    'use strict';

    angular.module('rombusYeoApp')
        .service('WizardProjectService', ['$q', 'BackendService', 'ParameterService', 'UserService', function($q, BackendService, ParameterService, UserService) {

            var service = this;
            service.currentStep = 1;
            service.currentProject = {};

            service.getAllUserProjects = function () {
                var deferred = $q.defer();
                var data = { userId: UserService.userId };
                BackendService.standardPost('/project/getAll', data).then(
                    function(response) {
                        angular.forEach(response, function(item){
                            ParameterService.getSpecAreaNameFromId(item.speciality).then(
                                function(spec){ item.specialityName = spec.description; },
                                function() { item.specialityName = '';}
                            );
                            if(item.specialtyFunctionId !== null && item.specialtyFunctionId !== undefined){
                              ParameterService.getSpecialtyFunctionFromId(item.specialtyFunctionId).then(
                                function(specFun) { item.specialtyFunctionDescription = specFun.description; },
                                function () { item.specialtyFunctionDescription = ''; }
                              );
                            }
                            if(item.projectSkills !== undefined && item.projectSkills !== null){
                              angular.forEach(item.projectSkills, function (ps) {
                                ParameterService.getSpecAreaNameFromId(ps.specialityid).then(
                                  function(specArea) { ps.type = specArea.type; },
                                  function() {}
                                );
                              });
                            }
                        });
                        deferred.resolve(response);
                    },
                    function () { deferred.reject();}
                );
                return deferred.promise;
            };

            service.createProject = function (project) {
                var deferred = $q.defer();
                project.userId = UserService.userId;
                BackendService.standardPost('/project/create', project).then(
                    function(response) {
                        if(response.resultOk === true){
                            project.projectId = response.createdElementId;
                            service.currentProject = project;
                            service.currentStep = 2;
                            deferred.resolve(response);
                        }
                        else{
                            deferred.reject();
                        }
                    },
                    function () { deferred.reject();}
                );
                return deferred.promise;
            };

            service.updateProject = function (project) {
              var deferred = $q.defer();
              BackendService.standardPost('/project/update', project).then(
                function(response) {
                  if(response.resultOk === true){
                    service.currentProject = project;
                    service.currentStep = service.currentStep + 1;
                    deferred.resolve(response);
                  }
                  else{
                    deferred.reject();
                  }
                },
                function () { deferred.reject();}
              );
              return deferred.promise;
            };

          service.updateProjectAsset = function (project) {
            var deferred = $q.defer();
            BackendService.standardPost('/project/updateAsset', project).then(
              function(response) {
                if(response.resultOk === true){
                  service.currentProject.comments = project.comments;
                  service.currentProject.attachment = project.attachment;
                  service.currentProject.attachmentName = project.attachmentName;
                  service.currentStep = service.currentStep + 1;
                  deferred.resolve(response);
                }
                else{
                  deferred.reject();
                }
              },
              function () { deferred.reject();}
            );
            return deferred.promise;
          };

          service.deleteProjectAsset = function (project) {
            var deferred = $q.defer();
            BackendService.standardPost('/project/deleteAsset', project).then(
              function(response) {
                if(response.resultOk === true){
                  project.attachment = null;
                  service.currentProject = project;
                  service.currentStep = service.currentStep + 1;
                  deferred.resolve(response);
                }
                else{
                  deferred.reject();
                }
              },
              function () { deferred.reject();}
            );
            return deferred.promise;
          };

          service.publishProject = function (project) {
            var deferred = $q.defer();
            project.userId = UserService.userId;
            BackendService.standardPost('/project/publish', project).then(
              function(response) {
                if(response.resultOk === true){
                  deferred.resolve(response);
                }
                else{
                  deferred.reject(response);
                }
              },
              function () { deferred.reject();}
            );
            return deferred.promise;
          };

          service.calculateSuggestedPrice = function (minPrice, maxPrice, workerTypeId, expertise) {
            var result = '';
            if(minPrice !== null && minPrice !== undefined && maxPrice !== null && maxPrice !== undefined){
              if(workerTypeId === 1){
                if(expertise === 1){
                  result = minPrice * 0.8 + '-' + maxPrice * 0.8;
                }
                else if(expertise === 2){
                  result = minPrice + '-' + maxPrice;
                }
                else if(expertise === 3){
                  result = minPrice * 1.2 + '-' + maxPrice * 1.2;
                }
              }
              else if(workerTypeId === 2){
                result = minPrice * 1.3 + '-' + maxPrice * 1.3;
              }
              else if(workerTypeId === 3){
                result = minPrice * 1.3 + '-' + maxPrice * 1.3;
              }
              else if(workerTypeId === 4){
                result = minPrice * 1.5 + '-' + maxPrice * 1.5;
              }
            }
            return result;
          };
        }]);
})();
