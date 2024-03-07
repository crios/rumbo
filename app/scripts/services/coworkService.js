(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('CoworkService', [ '$http', '$q', 'BackendService', function($http, $q, BackendService) {

      var service = this;

      service.getCoworkList = function () {
        var deferred = $q.defer();
        BackendService.standardPostWithTimeoutRtaReponse('/cowork/getCoworks', {}).then(
          function (response) {
            angular.forEach(response.data, function (eachObj) {
              eachObj.alias = [eachObj.name, eachObj.neighborhood, eachObj.city, eachObj.country]
                .filter(function (val) {return val;}).join(', ');
            });
            deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getCowork = function (coworkId) {
        var deferred = $q.defer();
        var data = {'id': coworkId};
        BackendService.standardPostWithTimeoutRtaReponse('/cowork/get', data).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getPlans = function (coworkId) {
        var deferred = $q.defer();
        var data = {'id': coworkId};
        BackendService.standardPostWithTimeoutRtaReponse('/cowork/getPlans', data).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getServices = function (coworkId) {
        var deferred = $q.defer();
        var data = {'id': coworkId};
        BackendService.standardPostWithTimeoutRtaReponse('/cowork/getServices', data).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getMapLocation = function (coworkId) {
        var deferred = $q.defer();
        var data = {'id': coworkId};
        BackendService.standardPostWithTimeoutRtaReponse('/cowork/getLocation', data).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getImages = function (coworkId) {
        var deferred = $q.defer();
        var data = { 'id': coworkId };
        BackendService.standardPostWithTimeoutRtaReponse('/cowork/getImgs', data).then(
          function (response) { deferred.resolve(processImages(response.data)); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      function processImages(data){
        var resp = {};
        resp.images = [];
        var count = 0;
        angular.forEach(data.images, function (item) {
          if(item.imageType === 0){
            var temp = {};
            temp.id = count;
            temp.ref = item.imagePath;
            resp.images.push(temp);
            count++;
          }
          if(item.imageType === 1){
            resp.banner = item.imagePath;
          }
        });

        return resp;
      }

    }]);
})();
