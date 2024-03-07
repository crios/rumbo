(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('LoginService', [ '$http', '$q', '$rootScope', 'UserService', 'BroadcastService',
      'RegisterService', 'socialLoginService', 'ParameterService', 'BackendService', 'localStorageService',
      function($http, $q, $rootScope, UserService, BroadcastService, RegisterService, socialLoginService, ParameterService, BackendService, localStorageService) {

      var service = this;
      service.passRestored = false;

      service.doNormalLogin = function (email, pass, loginType) {
        var deferred = $q.defer();
        var data = { 'email': email, 'password': pass, 'loginType': loginType };
        BackendService.standardPostWithTimeoutRtaReponse('/login/user', data).then(
          function(response){ processLoginResponse(deferred, response, loginType); },
          function(error){ deferred.reject(error);
        });
        return deferred.promise;
      };

      service.SetCredentials = function (loginType, userId, username, defaultProfile) {

        var prof = defaultProfile !== undefined && defaultProfile !== null ? defaultProfile : 1;
        UserService.loginUser(loginType, userId, username, prof);

        // store user details in local storage (or until they logout)
        localStorageService.set('userLogged', true);
        localStorageService.set('loginType', loginType);
        localStorageService.set('userId', userId);
        localStorageService.set('username', username);
        localStorageService.set('defaultProfile', prof);

        BroadcastService.rootScopeBroadcast('userLoginStatus',{});
      };

      service.ClearCredentials = function () {
        localStorageService.set('userLogged', false);
        localStorageService.remove('loginType');
        localStorageService.remove('userId');
        localStorageService.remove('username');
        localStorageService.remove('defaultProfile');
        UserService.logoutUser();

        BroadcastService.rootScopeBroadcast('userLoginStatus',{});
      };

      service.updateDefaultProfileInCookie = function(profilePreference){
        localStorageService.set('defaultProfile', profilePreference);
      };

      service.forgotPass = function (email) {
        var deferred = $q.defer();
        var data = { 'email': email };
        BackendService.standardPostWithTimeoutRtaReponse('/user/resetPwd', data).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.updatePass = function (email, pass, newPass) {
        var deferred = $q.defer();
        var data = { 'email': email, 'password': pass, 'loginType': '1', 'newPassword': newPass };
        BackendService.standardPostWithTimeoutRtaReponse('/user/updPwd', data).then(
          function(response){ processResponse(deferred, response); },
          function(error){ deferred.reject(error);
        });
        return deferred.promise;
      };

      service.validateResetPwd = function (email, hash, newPass) {
        var deferred = $q.defer();
        var data = { 'email': email, 'validationHash': hash, 'newPassword': newPass, 'loginType': '1' };
        BackendService.standardPostWithTimeoutRtaReponse('/user/validateResetPwd', data).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.facebookLogin = function (userDetails) {
        var deferred = $q.defer();
        ParameterService.getUserTypeIdFromName('Facebook').then(
          function (userType) {
            service.doNormalLogin(userDetails.email, userDetails.token, userType.id).then(
              function (response) {
                service.SetCredentials(userType, response.userId, userDetails.email, response.defaultProfile);
                deferred.resolve('success');
              },
              function(){
                RegisterService.registerRRSS(userType, userDetails).then(
                  function(response){
                    service.SetCredentials(userType, response.userId, userDetails.email);
                    deferred.resolve('success');
                  },
                  function (error) {
                    socialLoginService.logout();
                    deferred.reject(error);
                  }
                );
              }
            );
          },
          function(error){
            socialLoginService.logout();
            deferred.reject(error);
          }
        );
        return deferred.promise;
      };

      service.googleLogin = function(userDetails) {
        var deferred = $q.defer();
        ParameterService.getUserTypeIdFromName('Google Plus').then(
          function (userType) {
            service.doNormalLogin(userDetails.email, userDetails.token, userType.id).then(
              function (response) {
                service.SetCredentials(userType, response.userId, userDetails.email, response.defaultProfile);
                deferred.resolve('success');
              },
              function(error){
                socialLoginService.logout();
                deferred.reject(error);
              }
            );
          },
          function(error){
            socialLoginService.logout();
            deferred.reject(error);
          }
        );
        return deferred.promise;
      };

      service.linkedIn = function (code, state) {
        var deferred = $q.defer();
        ParameterService.getUserTypeIdFromName('Linkedin').then(
          function (userType) {
            var loginType = userType.id;
            var data = { 'loginType': loginType, 'authorizationCode': code, 'state': state };
            BackendService.standardPost('/login/user', data).then(
              function(response) {
                if (response.resultOk === true) {
                  service.SetCredentials(loginType, response.userId, response.description, response.defaultProfile);
                  deferred.resolve(data);
                }
                else{
                  deferred.reject(data);
                }
              },
              function(error){ deferred.reject(error);
            });
          },
          function(error){deferred.reject(error); }
        );
        return deferred.promise;
      };

      function processResponse(deferred, response) {
        if(response.data.resultOk === true){
          deferred.resolve(response.data);
        }
        else{
          deferred.reject(response.data);
        }
      }

      function processLoginResponse(deferred, response, loginType){
        response.data.loginType = loginType;
        if(response.data.resultOk === true){
          deferred.resolve(response.data);
        }
        else{
          deferred.reject(response.data);
        }
      }

    }]);
})();
