(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('UserService', ['$rootScope', 'ParameterService', 'BackendService', '$q', 'BroadcastService', function($rootScope, ParameterService, BackendService, $q, BroadcastService) {

      var service = this;
      service.loginType = null;
      service.userId = null;
      service.email = null;
      service.password = null;
      service.isLogged = false;
      service.isSelfUser = true;
      service.otherUserId = null;
      service.profilePicture = null;
      service.membership = null;
      service.basicInfo = null;
      service.profilePreference = null;
      var userMembershipCall = null;
      var basicInfoCall = null;

      service.getIdForServiceRequest = function () {
        return service.isSelfUser ? service.userId : service.otherUserId;
      };

      service.expressTransientLogin = function(email, userId){

        service.email = email;
        service.userId = userId;
        service.isLogged = true;
        service.loginType = 1;
      };

      service.loginUser = function (loginType, userId, username, profilePreference) {
        service.isLogged = true;
        service.loginType = loginType;
        service.userId = userId;
        service.email = username;
        service.profilePreference = profilePreference;
        $rootScope.globalIsUserLogged = true;
        service.getUserMembership().then(
          function (response) { service.membership = response; },
          function () { service.membership = null; }
        );
        service.getBasicInfo().then(
          function(response) { service.basicInfo = response; },
          function() { service.basicInfo = null; }
        );
      };

      service.logoutUser = function () {
        service.isLogged = false;
        service.loginType = null;
        service.userId = null;
        service.email = null;
        service.password = null;
        service.profilePicture = null;
        service.membership = null;
        service.basicInfo = null;
        BroadcastService.rootScopeBroadcast('user-logout', {});
      };

      service.getUserMembership = function () {
        if(userMembershipCall!== null && userMembershipCall.$$state.status === 0){
          return userMembershipCall;
        }
        else {
          var deferred = $q.defer();
          if(service.membership !== null){ deferred.resolve(service.membership); }
          else{
            userMembershipCall = deferred.promise;
            var data = {'userId': service.userId};
            BackendService.standardPostWithTimeoutRtaReponse('/profile/getUserMembership', data).then(
              function (response) {
                if(response.status  !== 204){
                  ParameterService.getUserMembershipsById(response.data.membershipid).then(
                    function (response) { deferred.resolve(response);},
                    function () { deferred.reject(null); }
                  );
                }
                else{ deferred.reject(''); }
              },
              function(){ deferred.reject(''); }
            );
          }
        }
        return userMembershipCall;
      };

      service.getBasicInfo = function () {
        if(basicInfoCall!== null && basicInfoCall.$$state.status === 0){
          return basicInfoCall;
        }
        else {
          var deferred = $q.defer();
          basicInfoCall = deferred.promise;
          var data = {'userId': service.userId};
          BackendService.standardPost('/profile/getBasicInformation', data).then(
            function (response) { deferred.resolve(response); },
            function (error) { deferred.reject(error); }
          );
        }
        return basicInfoCall;
      };

      service.setProfileCompany = function () {
        var deferred = $q.defer();
        var data = {'userid': service.userId, 'defaultProfile': 2};
        BackendService.standardPost('/login/updateDefaultProfile', data).then(
          function (response) { service.profilePreference = '2'; deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.setProfileProfessional = function () {
        var deferred = $q.defer();
        var data = {'userid': service.userId, 'defaultProfile': 1};
        BackendService.standardPost('/login/updateDefaultProfile', data).then(
          function (response) { service.profilePreference = '1'; deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

    }]);
})();

