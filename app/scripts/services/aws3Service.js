(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('AwsS3Service', [ '$http', '$location', '$q', 'UserService', 'BroadcastService', 'ProfileService', 'BackendService', 'WizardProjectService',
      function($http, $location, $q, UserService, BroadcastService, ProfileService, BackendService, WizardProjectService) {

      var service = this;
      service.profilePictureUpdated = false;
      service.tempProfilePictureCall = null;

      function updateProfilePictureReference(deferred, response) {
        var imageRef = response !== null ? response.filePath : null;
        var dataImage = { 'userId': UserService.userId, 'image': imageRef };
        BackendService.standardPost('/profile/updImage', dataImage).then(
          function (res) {
            service.profilePictureUpdated = true;
            BroadcastService.rootScopeBroadcast('profPicUpdated', {});
            BroadcastService.rootScopeBroadcast('userAvgUpdated', {});
            deferred.resolve(res);
          },
          function (er) { deferred.reject(er); }
        );
      }

      function processPictureAnswer(response) {

        if (angular.isDefined(response.profPic)) {
          return response.profPic || null;
        } else {
          return null;
        }
      }

      function updateLogo(deferred, response) {
        console.log('updateLogo', response);
        var imageRef = response !== null ? response.filePath : null;
        var dataImage = { 'userId': UserService.userId, 'logo': imageRef };
        BackendService.standardPost('/companyProfile/updLogo', dataImage).then(
          function (res) {
            BroadcastService.rootScopeBroadcast('userCompanyLogoUpdated', {});
            deferred.resolve(res);
          },
          function (er) { deferred.reject(er); }
        );
      }

      service.uploadPorfolioFile = function (file, headerType, headerTitle, headerDescription) {
        var deferred = $q.defer();
        var fileExt = file.name.split('.').pop();
        var data = { 'userId': UserService.userId, 'fileName': file.name, 'fileExt': fileExt };
         BackendService.standardPost('/aws/getPortfolioSignedPut', data).then(
          function(response){
            BackendService.standardPutAmazon(response.signedUrl, file).then(
              function () {
                ProfileService.addPortfolioItem(headerType, headerTitle, headerDescription, response.filePath, 1).then(
                  function (re) { deferred.resolve(re); },
                  function (er) { deferred.reject(er); }
                );
              },
              function (err) {
                deferred.reject(err);
              }
            );
          },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.uploadPorfolioImageWithPreview = function (file, preview, headerType, headerTitle, headerDescription) {
        var deferred = $q.defer();
        var fileExt = file.name.split('.').pop();
        var data = { 'userId': UserService.userId, 'fileName': file.name, 'fileExt': fileExt};
        BackendService.standardPost('/aws/getPortfolioSignedPut', data).then(
          function(response) {
            BackendService.standardPutAmazon(response.signedUrl, file).then(
              function () {
                var dataPreview = { 'userId': UserService.userId, 'fileName': response.fileNameGen, 'fileExt': fileExt };
                BackendService.standardPost('/aws/getPortfolioSignedPut', dataPreview).then(
                  function(resp) {
                    BackendService.standardPutAmazon(resp.signedUrl, preview).then(
                      function () {
                        ProfileService.addPortfolioItem(headerType, headerTitle, headerDescription, response.filePath, 1, resp.filePath).then(
                          function (re) { deferred.resolve(re); },
                          function (er) { deferred.reject(er); }
                        );
                      }, function (e) { deferred.reject(e); });
                  },
                  function (erro) { deferred.reject(erro); }
                );
              },
              function (err) { deferred.reject(err); }
            );
          },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.getProfilePicture = function (isSelfUser) {
        if(service.tempProfilePictureCall!== null && service.tempProfilePictureCall.$$state.status === 0){
          return service.tempProfilePictureCall;
        }
        else{
          var deferred = $q.defer();
          service.tempProfilePictureCall = deferred.promise;
          if(UserService.profilePicture !== null && service.profilePictureUpdated === false){
            deferred.resolve(UserService.profilePicture);
          }
          else{
            var data = isSelfUser === true ? {'userId': UserService.userId} : { 'userId': UserService.getIdForServiceRequest() };
            BackendService.standardPost('/aws/getProfilePicture', data).then(
              function(response){
                UserService.profilePicture = processPictureAnswer(response);
                service.profilePictureUpdated = false;
                deferred.resolve(UserService.profilePicture);
              },
              function(error){ deferred.reject(error); }
            );
          }
        }
        return service.tempProfilePictureCall;
      };

      service.getOtherUserProfPicture = function () {
        var deferred = $q.defer();
        var data = {'userId': UserService.getIdForServiceRequest()};
        BackendService.standardPost('/aws/getProfilePicture', data).then(
          function(response){ deferred.resolve(processPictureAnswer(response));},
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

      service.updateProfilePicture = function (file, name) {
        var deferred = $q.defer();
        if(file === null){ updateProfilePictureReference(deferred, name); }
        else {
          var data = { 'userId': UserService.userId, 'fileName': name };
          BackendService.standardPost('/aws/updProfilePicture', data).then(
            function(response){
              BackendService.standardPutAmazon(response.signedUrl, file).then(
                function () { updateProfilePictureReference(deferred, response); },
                function (err) { deferred.reject(err); }
              );
            },
            function(error){ deferred.reject(error); }
          );
        }
        return deferred.promise;
      };

      service.uploadLogo= function (file, name) {
        var deferred = $q.defer();
        if(file === null){ updateLogo(deferred, name); }
        else {
          var data = { 'userId': UserService.userId, 'fileName': name };
          BackendService.standardPost('/aws/updUserCompanyLogo', data).then(
            function(response){
              BackendService.standardPutAmazon(response.signedUrl, file).then(
                function () { updateLogo(deferred, response); },
                function (err) { deferred.reject(err); }
              );
            },
            function(error){ deferred.reject(error); }
          );
        }
        return deferred.promise;
      };

      service.uploadProjectAsset = function (file, projectId, comments) {
        var deferred = $q.defer();
        var fileExt = file.name.split('.').pop();
        var data = { 'userId': UserService.userId, 'fileName': file.name, 'fileExt': fileExt, 'projectId': projectId };
        BackendService.standardPost('/aws/getProjectAssetSignedPut', data).then(
          function(response){
            console.log('AWS PUT details', response);
            BackendService.standardPutAmazon(response.signedUrl, file).then(
              function () {
                var project = {projectId: projectId, comments: comments, attachment: response.filePath, attachmentName: file.name};
                WizardProjectService.updateProjectAsset(project).then(
                  function (resp) { deferred.resolve(resp); },
                  function (err) { deferred.reject(err); }
                );
              },
              function (err) {
                deferred.reject(err);
              }
            );
          },
          function(error){ deferred.reject(error); }
        );
        return deferred.promise;
      };

    }]);
})();

