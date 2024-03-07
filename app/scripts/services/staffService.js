(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('StaffService', [ '$http', '$q', 'UserService', 'BackendService', function($http, $q, UserService, BackendService) {

      var service = this;
      service.searchResults = null;
      service.search_specAreaId = null;
      service.search_skillId = null;
      service.search_country = null;
      service.search_fullName = null;

      service.getCurrentSearchResults = function(){
        var deferred = $q.defer();
        deferred.resolve(service.searchResults);
        return deferred.promise;
      };

      service.findUsers = function (specAreaId, skillId, country, fullName) {
        var deferred = $q.defer();
        service.search_specAreaId = specAreaId;
        service.search_skillId = skillId;
        service.search_country = country;
        service.search_fullName = fullName;
        var data = {'specialityId': specAreaId, 'skillId': skillId, 'country': country, 'fullName': fullName};
        BackendService.standardPostWithTimeout('/staff/searchGrid', data, 10000).then(
          function (response) { service.searchResults = response; deferred.resolve(service.searchResults); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getDefaultGridUsers = function (poolCache) {
        var deferred = $q.defer();
        var data = {'userId': UserService.getIdForServiceRequest(), 'poolCache': poolCache };
        BackendService.standardPostWithTimeout('/staff/getGrid', data, 10000).then(
          function (response) { service.searchResults = response; deferred.resolve(response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.sendUserContactNotification = function (otherUserId) {
        var deferred = $q.defer();
        var data = {'userId': otherUserId };
        BackendService.standardPost('/staff/notifyUser', data).then(
          function (response) { deferred.resolve(response.data); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

    }]);
})();
