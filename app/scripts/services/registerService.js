
(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('RegisterService', [ '$http', '$q', 'BackendService', function($http, $q, BackendService) {

      var service = this;

      function processResultOkResponse(deferred, data) {
        if(data.resultOk === true){ deferred.resolve(data); }
        else{ deferred.reject(data); }
      }

      service.register = function (user) {
        var deferred = $q.defer();
        var data = {'name': user.firstName, 'surname': user.lastName, 'email': user.email, 'password': user.pass, 'userType': '1'};
        BackendService.standardPost('/register/user', data).then(
          function (response) { console.log('REGREG RESPONSE', response); processResultOkResponse(deferred, response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.registerRRSS = function(userType, user){
        var deferred = $q.defer();
        var data = { 'name': user.firstName, 'surname': user.lastName, 'email': user.email, 'userType': userType.id};
        BackendService.standardPost('/register/user', data).then(
          function (response) { deferred.resolve(response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.resendRegistrationEmail = function (email) {
        console.log('Calling RegisterService.resendRegistrationEmail for ', email);
        var deferred = $q.defer();
        /*$http({
          url : config.endpoint + '/register/user',
          timeout: config.timeout,
          method : 'POST',
          data : { 'email': email,  'userType': '1'}
        }).then(function(response){
          deferred.resolve(response);
        }, function(error){
          deferred.reject(error);
        });*/
        deferred.resolve('ok');
        return deferred.promise;
      };

      service.confirmRegistration = function (email, hash) {
        var deferred = $q.defer();
        var data = { 'email': email, 'validationHash': hash} ;
        BackendService.standardPost('/register/chkMail', data).then(
          function (response) { deferred.resolve(response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.closeAccount = function (userId) {
        var deferred = $q.defer();
        var data = { 'userId': userId} ;
        BackendService.standardPost('/register/closeAccount', data).then(
          function (response) { deferred.resolve(response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };
    }]);
})();
