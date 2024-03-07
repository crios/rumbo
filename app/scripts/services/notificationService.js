(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('NotificationService', [ '$http', '$location', '$q', 'BackendService', function($http, $location, $q, BackendService) {

      var service = this;

      service.updateNotification = function (notificationId, accepted) {
        var deferred = $q.defer();
        var data = { 'notificationId' : notificationId, 'accepted' : accepted };
        BackendService.standardPostWithTimeoutRtaReponse('/notification/consume' , data).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

    }]);
})();

