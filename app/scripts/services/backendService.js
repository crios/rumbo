(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('BackendService', [ '$http', '$q', function($http, $q) {

      var service = this;

      service.standardPostForParameters = function (relativeEndpoint, data) {
        var deferred = $q.defer();
        $http({
          url : config.endpoint + relativeEndpoint,
          timeout: config.timeout,
          method : 'POST',
          data : data
        }).then(function(response){
          deferred.resolve(response.data.cfg);
        }, function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      };

      service.standardPost = function (relativeEndpoint, data) {
        var deferred = $q.defer();
        $http({
          url : config.endpoint + relativeEndpoint,
          timeout: config.timeout,
          method : 'POST',
          data : data
        }).then(function(response){
          deferred.resolve(response.data);
        }, function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      };

      service.standardPostWithTimeout = function (relativeEndpoint, data, timeout) {
        var deferred = $q.defer();
        $http({
          url : config.endpoint + relativeEndpoint,
          timeout: timeout,
          method : 'POST',
          data : data
        }).then(function(response){
          deferred.resolve(response.data);
        }, function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      };

      service.standardPostWithTimeoutRtaReponse = function (relativeEndpoint, data) {
        var deferred = $q.defer();
        $http({
          url : config.endpoint + relativeEndpoint,
          timeout: config.timeout,
          method : 'POST',
          data : data
        }).then(function(response){
          deferred.resolve(response);
        }, function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      };

      service.standardGetWithTimeout = function (relativeEndpoint, data) {
        var deferred = $q.defer();
        $http({
          url : config.endpoint + relativeEndpoint,
          timeout: 10000,
          method : 'GET',
          data : data
        }).then(function(response){
          deferred.resolve(response.data);
        }, function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      };

      service.standardPutAmazon = function (url, data) {
        var deferred = $q.defer();
        $http({
          method: 'PUT', url: url, data: data, headers: { 'Content-Type': 'binary/octet-stream' }
        }).then(function(response){
          deferred.resolve(response);
        }, function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      };

    }]);
})();

