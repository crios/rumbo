(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('GroupService', [ '$http', '$location', '$q', 'BackendService', 'UserService', function($http, $location, $q, BackendService, UserService) {

      var service = this;

      service.createGroup = function (name) {
        var deferred = $q.defer();
        var data = { 'ownerGroupUserId' : UserService.userId, 'name': name };
        BackendService.standardPostWithTimeoutRtaReponse('/group/create', data).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.updateGroupName = function (groupId, name) {
        var deferred = $q.defer();
        var data = { 'groupId' : groupId, 'name': name };
        BackendService.standardPostWithTimeoutRtaReponse('/group/update', data).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.inviteUser = function (userToAddId, groupId, ownerId) {
        var deferred = $q.defer();
        var data = { 'userId' : userToAddId, 'groupId': groupId, 'ownerGroupUserId' : ownerId };
        BackendService.standardPostWithTimeoutRtaReponse('/group/inviteUser', data).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.requestGroupPermission = function (userToAddId, groupId, ownerId) {
        var deferred = $q.defer();
        var data = { 'userId' : userToAddId, 'groupId': groupId, 'ownerGroupUserId' : ownerId };
        BackendService.standardPostWithTimeoutRtaReponse('/group/requestAccess', data).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.removeMember = function (participantId, userId, groupId, ownerId) {
        var deferred = $q.defer();
        var data = { 'groupParticipantId' : participantId, 'userId' : userId,
                     'groupId': groupId, 'ownerGroupUserId' : ownerId };
        BackendService.standardPostWithTimeoutRtaReponse('/group/deleteUser', data).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.removeMyself = function (groupId, ownerId) {
        var deferred = $q.defer();
        var data = { 'userId' : UserService.userId, 'groupId': groupId, 'ownerGroupUserId' : ownerId };
        BackendService.standardPostWithTimeoutRtaReponse('/group/deleteMyself', data).then(
          function (response) { deferred.resolve(response); },
          function(error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.closeGroup= function (groupId) {
        var deferred = $q.defer();
        var data = { 'userId' : UserService.userId, 'groupId': groupId };
        BackendService.standardPostWithTimeoutRtaReponse('/group/close', data).then(
          function (response) { deferred.resolve(response); },
          function(error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

    }]);
})();

