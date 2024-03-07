(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('SpecAreaService', [ '$http', '$q', 'UserService', 'BroadcastService', 'BackendService',
      function($http, $q, UserService, BroadcastService, BackendService) {

      var service = this;
      service.tempCall = null;
      service.spec1 = null;
      service.spec2 = null;

      service.getUserSpecAreas= function () {
        if(service.tempCall!== null && service.tempCall.$$state.status === 0){
          return service.tempCall;
        }
        else{
          var deferred = $q.defer();
          service.tempCall = deferred.promise;
          var data = {'userId': UserService.getIdForServiceRequest()};
          BackendService.standardPost('/profile/getSpecialities', data).then(
            function (response) { deferred.resolve(response); },
            function(error){ deferred.reject(error); }
          );
        }
        return service.tempCall;
      };

      service.saveAreas= function () {
        if(service.spec1 === null && service.spec2 !== null){
          service.spec1 = service.spec2;
          service.spec2 = null;
        }
        var deferred = $q.defer();
        var data = {'userId': UserService.userId, 'mainspecialityid': service.spec1, 'secondaryspecialityid': service.spec2 };
        BackendService.standardPost('/profile/updSpecialities', data).then(
          function (response) { deferred.resolve(response); BroadcastService.rootScopeBroadcast('specAreasUpdated', {});},
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

    }]);
})();
