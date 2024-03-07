(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.services:ParameterService
   * @description Service to manage platform parameters
   *
   * NOTE: a local variable should be used to keep the values that
   * are not expected to change during the session, so the performance
   * is improved by avoiding unneeded http calls
   */
  angular.module('rombusYeoApp')
    .service('ParameterService', [ '$http', '$q', '$filter', 'BackendService', function($http, $q, $filter, BackendService) {

      var service = this;
      service.userTypes = null;
      service.userMemberships = null;
      service.userFunctions = null;
      service.specAreas = null;
      service.specialtyCategories = null;
      service.specialtySubCategories = null;
      service.skills = null;
      service.portfolioTypes = null;
      service.notificationTypes = null;
      service.projectPaymentMethods = null;
      service.projectWorkerTypes = null;
      var userMembershipsCall = null;
      var userFunctionCall = null;
      var specAreasCall = null;
      var specialtyCategoriesCall = null;
      var specialtySubCategoriesCall = null;
      var skillsCall = null;
      var portfolioTypesCall = null;
      var notificationTypesCall = null;
      var projectPaymentMethodsCall = null;
      var projectWorkerTypesCall = null;

      service.initSpecAreasAndSkills = function () {
        service.getSkills();
        service.getSpecAreas();
      };

      service.initProfileParams = function () {
        service.getUserTypes();
        service.getUserMemberships();
        service.getUserFunction();
        service.getPortfolioTypes();
        service.getNotificationTypes();
      };

      service.getUserTypes = function () {
        var deferred = $q.defer();
        if(service.userTypes !== null){ deferred.resolve(service.userTypes); }
        else{
          BackendService.standardPostForParameters('/getCfg/userType', {}).then(
            function (response) {
              service.userTypes = response;
              deferred.resolve(response);
            },
            function (error) { deferred.reject(error); }
          );
        }
        return deferred.promise;
      };

      service.getUserMemberships = function () {
        if(userMembershipsCall!== null && userMembershipsCall.$$state.status === 0){
          return userMembershipsCall;
        }
        else{
          var deferred = $q.defer();
          if(service.userMemberships !== null){ deferred.resolve(service.userMemberships); }
          else{
            userMembershipsCall = deferred.promise;
            BackendService.standardPostForParameters('/getCfg/userMembership', {}).then(
              function (response) {
                service.userMemberships = response;
                deferred.resolve(response);
              },
              function (error) { deferred.reject(error); }
            );
          }
        }
        return userMembershipsCall;
      };

      service.getUserFunction = function () {
        if(userFunctionCall!== null && userFunctionCall.$$state.status === 0){
          return userFunctionCall;
        }
        else {
          var deferred = $q.defer();
          if (service.userFunctions !== null) { deferred.resolve(service.userFunctions); }
          else {
            userFunctionCall = deferred.promise;
            BackendService.standardPostForParameters('/getCfg/userFunction', {}).then(
              function (response) {
                service.userFunctions = response;
                deferred.resolve(response);
              },
              function (error) {
                deferred.reject(error);
              }
            );
          }
        }
        return userFunctionCall;
      };

      service.getSpecAreas = function () {
        if(specAreasCall!== null && specAreasCall.$$state.status === 0){
          return specAreasCall;
        }
        else {
          var deferred = $q.defer();
          if (service.specAreas !== null) { deferred.resolve(service.specAreas); }
          else {
            specAreasCall = deferred.promise;
            BackendService.standardPostForParameters('/getCfg/userSpecialities', {}).then(
              function (response) {
                try{
                  for(var i = response.length - 1; i >= 0; i--) {
                    if (response[i].description === 'None Selected') {
                      response.splice(i,1);
                    }
                  }
                  service.specAreas = $filter('orderBy')(response, 'description');
                }
                catch (e) { service.specAreas = []; }
                finally { deferred.resolve(service.specAreas); }
              },
              function (error) {
                deferred.reject(error);
              }
            );
          }
        }
        return specAreasCall;
      };

        service.getSpecialtyCategories = function () {
            if(specialtyCategoriesCall!== null && specialtyCategoriesCall.$$state.status === 0){
                return specialtyCategoriesCall;
            }
            else {
                var deferred = $q.defer();
                if (service.specialtyCategories !== null) { deferred.resolve(service.specialtyCategories); }
                else {
                    specialtyCategoriesCall = deferred.promise;
                    BackendService.standardPostForParameters('/getCfg/specialtyCategories', {}).then(
                        function (response) {
                            try { service.specialtyCategories = $filter('orderBy')(response, 'name'); }
                            catch(err) { service.specialtyCategories = []; }
                            finally { deferred.resolve(service.specialtyCategories); }
                        },
                        function (error) {
                            deferred.reject(error);
                        }
                    );
                }
            }
            return specialtyCategoriesCall;
        };

      service.getSpecialtySubCategories = function () {
        if(specialtySubCategoriesCall!== null && specialtySubCategoriesCall.$$state.status === 0){
          return specialtyCategoriesCall;
        }
        else {
          var deferred = $q.defer();
          if (service.specialtySubCategories !== null) { deferred.resolve(service.specialtySubCategories); }
          else {
            specialtySubCategoriesCall = deferred.promise;
            BackendService.standardPost('/getCfg/specialtySubCategories', {}).then(
              function (response) {
                try {
                  var map = new Map(Object.entries(response.map));
                  service.specialtySubCategories = map;
                  deferred.resolve(service.specialtySubCategories);}
                catch(err) { deferred.reject(); }
              },
              function (error) {
                deferred.reject(error);
              }
            );
          }
        }
        return specialtySubCategoriesCall;
      };

      service.getSkills = function () {
        if(skillsCall!== null && skillsCall.$$state.status === 0){
          return skillsCall;
        }
        else {
          var deferred = $q.defer();
          if (service.skills !== null) { deferred.resolve(service.skills); }
          else {
            skillsCall = deferred.promise;
            BackendService.standardPostForParameters('/getCfg/userSkills', {}).then(
              function (response) {
                try { service.skills = $filter('orderBy')(response, 'description'); }
                catch(err) { service.skills = []; }
                finally { deferred.resolve(service.skills); }
              },
              function (error) {
                deferred.reject(error);
              }
            );
          }
        }
        return skillsCall;
      };

      service.getPortfolioTypes = function () {
        if(portfolioTypesCall!== null && portfolioTypesCall.$$state.status === 0){
          return portfolioTypesCall;
        }
        else {
          var deferred = $q.defer();
          if (service.portfolioTypes !== null) { deferred.resolve(service.portfolioTypes); }
          else {
            portfolioTypesCall = deferred.promise;
            BackendService.standardPostForParameters('/getCfg/portfolioType', {}).then(
              function (response) {
                service.portfolioTypes = response;
                deferred.resolve(response);
              },
              function (error) { deferred.reject(error); }
            );
          }
        }
        return portfolioTypesCall;
      };

      service.getNotificationTypes = function () {
        if(notificationTypesCall!== null && notificationTypesCall.$$state.status === 0){
          return notificationTypesCall;
        }
        else {
          var deferred = $q.defer();
          if (service.notificationTypes !== null) { deferred.resolve(service.notificationTypes); }
          else {
            notificationTypesCall = deferred.promise;
            BackendService.standardPostForParameters('/getCfg/notificationType', {}).then(
              function (response) {
                service.notificationTypes = response;
                deferred.resolve(response);
              },
              function (error) { deferred.reject(error); }
            );
          }
        }
        return notificationTypesCall;

      };

        service.getProjectPaymentMethods = function () {
            if(projectPaymentMethodsCall!== null && projectPaymentMethodsCall.$$state.status === 0){
                return projectPaymentMethodsCall;
            }
            else {
                var deferred = $q.defer();
                if (service.projectPaymentMethods !== null) { deferred.resolve(service.projectPaymentMethods); }
                else {
                    projectPaymentMethodsCall = deferred.promise;
                    BackendService.standardPostForParameters('/getCfg/projectPaymentMethod', {}).then(
                        function (response) {
                            service.projectPaymentMethods = response;
                            deferred.resolve(response);
                        },
                        function (error) { deferred.reject(error); }
                    );
                }
            }
            return projectPaymentMethodsCall;

        };

        service.getProjectWorkerTypes = function () {
            if(projectWorkerTypesCall !== null && projectWorkerTypesCall.$$state.status === 0){
                return projectWorkerTypesCall;
            }
            else {
                var deferred = $q.defer();
                if (service.projectWorkerTypes !== null) { deferred.resolve(service.projectWorkerTypes); }
                else {
                    projectWorkerTypesCall = deferred.promise;
                    BackendService.standardPostForParameters('/getCfg/projectWorkerType', {}).then(
                        function (response) {
                            service.projectWorkerTypes = response;
                            deferred.resolve(response);
                        },
                        function (error) { deferred.reject(error); }
                    );
                }
            }
            return projectWorkerTypesCall;

        };

      service.getUserTypeById = function (id) {
        var deferred = $q.defer();
        service.getUserTypes().then(function (response) {
          deferred.resolve($filter('filter')(response, {id: id})[0]);
        });
        return deferred.promise;
      };

      service.getUserTypeIdFromName = function (name) {
        var deferred = $q.defer();
        service.getUserTypes().then(function (response) {
          deferred.resolve($filter('filter')(response, {description: name})[0]);
        });
        return deferred.promise;
      };

      service.getUserMembershipsById = function (id) {
        var deferred = $q.defer();
        service.getUserMemberships().then(function (response) {
          deferred.resolve($filter('filter')(response, {id: id})[0]);
        });
        return deferred.promise;
      };

      service.getUserFunctionById = function (id) {
        var deferred = $q.defer();
        service.getUserFunction().then(function (response) {
          deferred.resolve($filter('filter')(response, {id: id})[0]);
        });
        return deferred.promise;
      };

      service.getSpecAreaNameFromId = function (id) {
        var deferred = $q.defer();
        service.getSpecAreas().then(function (response) {
          deferred.resolve($filter('filter')(response, {id: id})[0]);
        });
        return deferred.promise;
      };

      service.getSpecAreaFromName = function (name) {
          var deferred = $q.defer();
          service.getSpecAreas().then(function (response) {
            deferred.resolve($filter('filter')(response, {type: name})[0]);
          });
          return deferred.promise;
      };

      service.getSpecialtyCategoryFromId = function (id) {
        var deferred = $q.defer();
        service.getSpecialtyCategories().then(function (response) {
          deferred.resolve($filter('filter')(response, {id: id})[0]);
        });
        return deferred.promise;
      };

      service.getPortfolioTypeIdFromName = function (name) {
        var deferred = $q.defer();
        service.getPortfolioTypes().then(function (response) {
          deferred.resolve($filter('filter')(response, {description: name})[0]);
        });
        return deferred.promise;
      };

      service.getPortfolioTypeNameFromId = function (id) {
        var deferred = $q.defer();
        service.getPortfolioTypes().then(function (response) {
          deferred.resolve($filter('filter')(response, {id: id})[0]);
        });
        return deferred.promise;
      };

      service.getNotificationTypeIdFromName = function (name) {
        var deferred = $q.defer();
        service.getNotificationTypes().then(function (response) {
          deferred.resolve($filter('filter')(response, {description: name})[0]);
        });
        return deferred.promise;
      };

      service.getSpecialtySubCategoryFromId = function (categoryId, id) {
        var deferred = $q.defer();
        if(categoryId !== null && categoryId !== undefined){
          service.getSpecialtySubCategories().then(
            function(subCategories){
              var list = subCategories.get(categoryId.toString());
              var subCat = $filter('filter')(list, {id: id})[0];
              deferred.resolve(subCat);
            },
            function(){ deferred.reject(); }
          );
        }
        else{ deferred.reject(); }
        return deferred.promise;
      };

    }]);
})();

