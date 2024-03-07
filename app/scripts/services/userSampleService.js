(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('UserSampleService', [ '$http', '$q', 'BackendService', function($http, $q, BackendService) {

      var service = this;

      service.getSampleServiceList = function () {
        var deferred = $q.defer();
        BackendService.standardPostWithTimeoutRtaReponse('/sample/getAll', {}).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getSample = function (sampleId) {
        var deferred = $q.defer();
        var data = {'sampleId': sampleId};
        BackendService.standardPostWithTimeoutRtaReponse('/sample/get', data).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

    }]);
})();
