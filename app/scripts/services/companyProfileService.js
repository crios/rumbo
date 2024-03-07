(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('CompanyProfileService', [ '$http', '$q', 'UserService', 'BroadcastService', 'BackendService', function($http, $q, UserService, BroadcastService, BackendService) {

      var service = this;
      service.basicInfoCall = null;
      service.userFunctionCall = null;
      service.userMembershipCall = null;
      service.userAvgCall = null;
      service.portfolioSize = 0;
      service.basicInfo = null;

      service.blankValues = function () {
        service.basicInfoCall = null;
        service.userFunctionCall = null;
        service.userMembershipCall = null;
        service.userAvgCall = null;
        service.portfolioSize = 0;
        service.basicInfo = null;
      };

      service.getBasicInfo = function () {
        if(service.basicInfoCall!== null && service.basicInfoCall.$$state.status === 0){
          return service.basicInfoCall;
        }
        else {
          var deferred = $q.defer();
          service.basicInfoCall = deferred.promise;
          var data = {'userId': UserService.getIdForServiceRequest()};
          BackendService.standardPost('/companyProfile/getBasicInformation', data).then(
            function (response) {
              service.basicInfo = response;
              service.basicInfo.memberSince = new Date(response.memberSince);
              deferred.resolve(response);
            },
            function (error) {
              service.basicInfo = null;
              deferred.reject(error);
            }
          );
        }
        return service.basicInfoCall;
      };

      service.updateBasicInfo = function (name, industry, city, country) {
        var deferred = $q.defer();
        var data = { 'userId': UserService.userId, 'name': name, 'industry': industry,
          'city': city, 'country': country };
        BackendService.standardPost('/companyProfile/updBasicInformation', data).then(
          function(response){ processResponse(deferred, response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.updateExtract = function (extract) {
        var deferred = $q.defer();
        var data = { 'userId': UserService.userId, 'extract': extract };
        BackendService.standardPost('/companyProfile/updExtract', data).then(
          function(response){
            BroadcastService.rootScopeBroadcast('userAvgUpdated', {});
            processResponse(deferred, response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      function processResponse(deferred, response) {
        if(response.resultOk === true){
          deferred.resolve(response.data);
        }
        else{
          deferred.reject(response.data);
        }
      }

    }]);
})();

