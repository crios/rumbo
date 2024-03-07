(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:PortfolioCtrl
   * @description
   * # PortfolioCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('ProfilePictureCtrl', [ '$uibModalInstance', '$scope', 'AwsS3Service', 'ModalService',
      function ($uibModalInstance, $scope, AwsS3Service, ModalService) {

      var ctrl = this;

        function dataURItoBlob(dataURI) {
          // convert base64 to raw binary data held in a string
          // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
          var byteString = atob(dataURI.split(',')[1]);

          // separate out the mime component
          /*var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];*/

          // write the bytes of the string to an ArrayBuffer
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          // write the ArrayBuffer to a blob, and you're done
          var bb = new Blob([ab]);
          return bb;
        }

        $scope.myImage='';
        $scope.myCroppedImage='';

        var handleFileSelect=function(evt) {
          var file=evt.currentTarget.files[0];
          var reader = new FileReader();
          reader.onload = function (evt) {
            $scope.$apply(function($scope){
              $scope.myImage=evt.target.result;
            });
          };
          reader.readAsDataURL(file);
        };

        $scope.fileNameChanged = function (ele) {
          var files = ele.files;
          var file=files[0];
          ctrl.fileRef = file;
          var reader = new FileReader();
          reader.onload = function () {
            $scope.$apply(function($scope){
              $scope.myImage=reader.result;
            });
          };
          reader.readAsDataURL(file);
        };

        ctrl.saveItem = function () {
          if(ctrl.fileRef !== undefined && $scope.myCroppedImage !== ''){
              AwsS3Service.updateProfilePicture(dataURItoBlob($scope.myCroppedImage),  'profilePic.png').then(
                function () { ctrl.cancel();},
                function () { ModalService.showErrorTryAgain(); }
              );
          }
          else{
            AwsS3Service.updateProfilePicture(null,  null).then(
              function () { ctrl.cancel();},
              function () { ModalService.showErrorTryAgain(); }
            );
          }
        };

        ctrl.cancel = function () {
          $uibModalInstance.close(ctrl);
        };

        angular.element('.fileInput').on('change',handleFileSelect);

    }]);
})();

