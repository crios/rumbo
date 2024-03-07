(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('ProfileService', [ '$http', '$q', 'UserService', 'BroadcastService', 'BackendService', function($http, $q, UserService, BroadcastService, BackendService) {

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
          BackendService.standardPost('/profile/getBasicInformation', data).then(
            function (response) {
              service.basicInfo = response;
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

      service.updateBasicInfo = function (firstName, lastName, jobTitle, city, country, cellphone, address, companyJobTitle) {
        var deferred = $q.defer();
        var data = { 'userId': UserService.userId, 'name': firstName, 'surname': lastName,
          'specialityDescr': jobTitle, 'location': city, 'country': country ,
          'cellphone': cellphone, 'address': address, 'companyJobTitle': companyJobTitle };
        BackendService.standardPost('/profile/updBasicInformation', data).then(
          function(response){
            BroadcastService.rootScopeBroadcast('userAvgUpdated', {});
            processResponse(deferred, response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getCv = function () {
        var deferred = $q.defer();
        var data = {'userId': UserService.getIdForServiceRequest()};
        BackendService.standardPost('/profile/getCV', data).then(
          function (response) { deferred.resolve(response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.updateCv = function (experiencia, formacion, certificaciones) {
        var deferred = $q.defer();
        var data = { 'userId': UserService.userId, 'experience': experiencia, 'formation': formacion, 'certifications': certificaciones };
        BackendService.standardPost('/profile/saveCV', data).then(
          function(response){
            BroadcastService.rootScopeBroadcast('userAvgUpdated', {});
            processResponse(deferred, response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getExtract = function () {
        var deferred = $q.defer();
        var data = {'userId': UserService.getIdForServiceRequest()};
        BackendService.standardPost('/profile/getUserExtract', data).then(
          function (response) { deferred.resolve(response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.updateExtract = function (extract) {
        var deferred = $q.defer();
        var data = { 'userId': UserService.userId, 'userextract': extract };
        BackendService.standardPost('/profile/updExtract', data).then(
          function(response){
            BroadcastService.rootScopeBroadcast('userAvgUpdated', {});
            processResponse(deferred, response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getMembership = function () {
        if(service.userMembershipCall!== null && service.userMembershipCall.$$state.status === 0){
          return service.userMembershipCall;
        }
        else {
          var deferred = $q.defer();
          service.userMembershipCall = deferred.promise;
          var data = {'userId': UserService.getIdForServiceRequest()};
          BackendService.standardPostWithTimeoutRtaReponse('/profile/getUserMembership', data).then(
            function (response) { processDataRequestResponse(deferred, response); },
            function(error){ deferred.reject(error); }
          );
        }
        return service.userMembershipCall;
      };

      service.getUserFunction = function () {
        if(service.userFunctionCall!== null && service.userFunctionCall.$$state.status === 0){
          return service.userFunctionCall;
        }
        else {
          var deferred = $q.defer();
          service.userFunctionCall = deferred.promise;
          var data = {'userId': UserService.getIdForServiceRequest()};
          BackendService.standardPostWithTimeoutRtaReponse('/profile/getUserFunction', data).then(
            function (response) { processDataRequestResponse(deferred, response); },
            function(error){ deferred.reject(error); }
          );
        }
        return service.userFunctionCall;
      };

      service.getPhoneAndAddress = function () {
        var deferred = $q.defer();
        var data = {'userId': UserService.getIdForServiceRequest()};
        BackendService.standardPost('/profile/getCellphoneAndAddress', data).then(
          function (response) { deferred.resolve(response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.updatePhoneAndAddress = function (cellphone, address) {
        var deferred = $q.defer();
        var data = { 'userId': UserService.userId, 'cellphone': cellphone, 'address':address };
        BackendService.standardPost('/profile/updCellphoneAndAddress', data).then(
          function(response){ processResponse(deferred, response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getEmail = function () {
        var deferred = $q.defer();
        var data = {'userId': UserService.getIdForServiceRequest()};
        BackendService.standardPost('/profile/getUserEmail', data).then(
          function (response) { deferred.resolve(response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.updateEmail = function (email) {
        var deferred = $q.defer();
        var data = { 'id': UserService.userId, 'email':email, 'usertypeid': UserService.loginType };
        BackendService.standardPost('/profile/updEmail', data).then(
          function(response){ processResponse(deferred, response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getPricePerHour = function () {
        var deferred = $q.defer();
        var data = {'userId': UserService.getIdForServiceRequest()};
        BackendService.standardPost('/profile/getAmountPerHour', data).then(
          function (response) { deferred.resolve(response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.updatePricePerHour = function (priceHour) {
        var deferred = $q.defer();
        var data = { 'userId': UserService.userId, 'amountperhour': priceHour };
        BackendService.standardPost('/profile/updAmountPerHour', data).then(
          function(response){ processResponse(deferred, response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getAvgCompleted = function () {
        if(service.userAvgCall!== null && service.userAvgCall.$$state.status === 0){
          return service.userAvgCall;
        }
        else {
          var deferred = $q.defer();
          service.userAvgCall = deferred.promise;
          var data = {'userId': UserService.getIdForServiceRequest()};
          BackendService.standardPost('/profile/getUserAverage', data).then(
            function (response) { deferred.resolve(response); },
            function(error){ deferred.reject(error); }
          );
        }
        return service.userAvgCall;
      };

      service.getPortfolioItems = function () {
        var deferred = $q.defer();
        var data = {'userId': UserService.getIdForServiceRequest()};
        BackendService.standardPost('/profile/getPorfolios', data).then(
          function (response) { service.portfolioSize = response.length; deferred.resolve(response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.addPortfolioItem = function(workType, title, description, url, isAws, preview) {
        var deferred = $q.defer();
        var data = { 'userId': UserService.getIdForServiceRequest(), 'workType': workType,
          'title': title, 'description': description, 'url': url, 'isAws': isAws, 'preview': preview};
        BackendService.standardPost('/profile/addPorfolio', data).then(
          function(response){
            BroadcastService.rootScopeBroadcast('portfolioUpdated', {});
            if(service.portfolioSize === 0){
              BroadcastService.rootScopeBroadcast('userAvgUpdated', {});
            }
            processResponse(deferred, response);
          },
          function(error){ deferred.reject(error);});
        return deferred.promise;
      };

      service.deletePortfolioItem = function (portfolioId) {
        var deferred = $q.defer();
        var data = { 'userPortfolioId': portfolioId };
        BackendService.standardPostWithTimeoutRtaReponse('/profile/removePorfolio', data).then(
          function(response){
            if(response.data.resultOk === true){
              BroadcastService.rootScopeBroadcast('portfolioItemDeleted', {});
              service.portfolioSize = service.portfolioSize - 1;
              deferred.resolve(response.data);
            }
            else{ deferred.reject(response.data); }
          },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.closeAccount = function () {
        var deferred = $q.defer();
        var data = { 'userId': UserService.userId } ;
        BackendService.standardPost('/profile/close', data).then(
          function (response) { deferred.resolve(response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.reactivateAccount = function () {

      };

      service.getUserGroups = function (forLoggedUser) {
        var deferred = $q.defer();
        var userId = forLoggedUser === true ? UserService.userId : UserService.getIdForServiceRequest();
        var data = {'userId': userId};
        BackendService.standardPost('/group/getUserGroups', data).then(
          function (response) { deferred.resolve(response); },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getUserNotifications = function (forLoggedUser) {
        var deferred = $q.defer();
        var userId = forLoggedUser === true ? UserService.userId : UserService.getIdForServiceRequest();
        var data = {'userId': userId};
        BackendService.standardPost('/notification/getForUser', data).then(
          function (response) { deferred.resolve(response); },
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

