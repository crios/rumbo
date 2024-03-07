(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('SkillService', [ '$http', '$q', 'BroadcastService', 'UserService', 'BackendService',
      function($http, $q, BroadcastService, UserService, BackendService) {

      var service = this;
      service.tempGetSkillsCall = null;
      service.skillsToDelete = [];
      service.skillsToAdd = [];
      service.userSkills = [];


      service.addSkill = function (skill) {
        var deferred = $q.defer();
        cleanUpTemps();
        service.skillsToAdd.push(skill);
        var data = { 'userId':UserService.userId, 'skillsToDelete': service.skillsToDelete, 'skillsToAdd': service.skillsToAdd};
        BackendService.standardPostWithTimeoutRtaReponse('/profile/updSkills', data).then(
          function (response) {
            BroadcastService.rootScopeBroadcast('skillsUpdated', {} );
            deferred.resolve(response);
          },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.deleteSkill = function (skill) {
        cleanUpTemps();
        service.skillsToDelete.push(skill);
        var deferred = $q.defer();
        var data = { 'userId':UserService.userId, 'skillsToDelete': service.skillsToDelete, 'skillsToAdd': service.skillsToAdd};
        BackendService.standardPostWithTimeoutRtaReponse('/profile/updSkills', data).then(
          function (response) {
            BroadcastService.rootScopeBroadcast('skillsUpdated', {} );
            deferred.resolve(response);
          },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.saveSkills = function () {
        var deferred = $q.defer();
        var data = { 'userId':UserService.userId, 'skillsToDelete': service.skillsToDelete, 'skillsToAdd': service.skillsToAdd};
        BackendService.standardPostWithTimeoutRtaReponse('/profile/updSkills', data).then(
          function (response) {
            cleanUpTemps();
            BroadcastService.rootScopeBroadcast('skillsUpdated', {} );
            deferred.resolve(response);
          },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

        service.getUserSkills = function () {
          if(service.tempGetSkillsCall!== null && service.tempGetSkillsCall.$$state.status === 0){
            return service.tempGetSkillsCall;
          }
          else {
            var deferred = $q.defer();
            service.tempGetSkillsCall = deferred.promise;
            var data = {'userId': UserService.getIdForServiceRequest()};
            BackendService.standardPost('/profile/getSkills', data).then(
              function (response) {
                service.userSkills = response;
                deferred.resolve(response);
              },
              function (error) { deferred.reject(error); }
            );
          }
          return service.tempGetSkillsCall;
        };

        function cleanUpTemps() {
          service.skillsToAdd = [];
          service.skillsToDelete = [];
        }
    }]);
})();
