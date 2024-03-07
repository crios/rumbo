(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('ContactService', [ '$http', '$location', '$q', 'BackendService', function($http, $location, $q, BackendService) {

      var service = this;

      service.sendMessage = function (message) {
        var deferred = $q.defer();
        var data = { 'fullName': message.fullName, 'company':message.company, 'email': message.email,
          'location' : message.location, 'reason': message.reason, 'query' : message.query};
        BackendService.standardPostWithTimeoutRtaReponse('/contact/us', data).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.sendCoworkMessage = function (message) {
        var deferred = $q.defer();
        var data = { 'id' : message.id, 'fullName' : message.fullName, 'query' : message.query, 'email' : message.email};
        BackendService.standardPostWithTimeoutRtaReponse('/cowork/contact', data).then(
          function (response) { deferred.resolve(response); },
          function (error) { deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.sendContactUser = function (contactType, requestorId, requestorName, requestorEmail, userIdToContact, message) {
        var deferred = $q.defer();
        var url = '';
        switch (contactType) {
          case 'contract':
            url = config.endpoint + '/contact/contract';
            break;
          case 'report':
            url = config.endpoint + '/contact/report';
            break;
        }
        if( url !== ''){
          $http({
            url: url,
            timeout: config.timeout,
            method: 'POST',
            data: { 'requestorId': requestorId, 'requestorName': requestorName,
              'requestorEmail': requestorEmail, 'userIdToContact': userIdToContact, 'message': message}
          }).then(function (response) {
            deferred.resolve(response);
          }, function (error) {
            deferred.reject(error);
          });
        }
        else{
          deferred.reject('Invalid contact TYPE');
        }
        return deferred.promise;

      };

    }]);
})();
