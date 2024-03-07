(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('FeedService', ['$q', 'BackendService', function($q, BackendService) {

      var service = this;

      service.getFeeds = function () {
        var deferred = $q.defer();
        var data = {  };
        BackendService.standardPost('/feed/getAll', data).then(
          function(response) {
            angular.forEach(response, function (item) {
              item.activationDate = new Date(item.activationDate);
            });
            deferred.resolve(response);
          },
          function () { deferred.reject();}
        );
        return deferred.promise;
      };

      service.getFeedDetails = function (id) {
        var deferred = $q.defer();
        var data = { feedId: id };
        BackendService.standardPost('/feed/get', data).then(
          function(response) { deferred.resolve(response); },
          function () { deferred.reject();}
        );
        return deferred.promise;
      };

    }]);
})();

