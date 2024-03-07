(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('PromoService', [ '$http', '$q', 'UserService', function($http, $q, UserService) {

      var service = this;

      service.getMembership = function () {
        var deferred = $q.defer();
        service.userFunctionCall = deferred.promise;
        $http({
          url: config.endpoint + '/profile/getUserMembership',
          timeout: config.timeout,
          method: 'POST',
          data: {'userId': UserService.userId}
        }).then(function (response) {
          processDataRequestResponse(deferred, response);
        }, function (error) {
          deferred.reject(error);
        });
        return service.userFunctionCall;
      };

      service.getUserFunction = function () {
        var deferred = $q.defer();
        $http({
          url: config.endpoint + '/profile/getUserFunction',
          timeout: config.timeout,
          method: 'POST',
          data: {'userId': UserService.userId}
        }).then(function (response) {
          processDataRequestResponse(deferred, response);
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };

      function processDataRequestResponse(deferred, response){
        if(response.status  !== 204){
          deferred.resolve(response.data);
        }
        else{
          deferred.reject(response);
        }
      }

    }]);
})();

