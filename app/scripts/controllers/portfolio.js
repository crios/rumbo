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
    .controller('PortfolioCtrl', [ '$uibModalInstance', '$scope', '$q', 'AwsS3Service', 'ModalService', 'ProfileService', 'ParameterService',
      function ($uibModalInstance, $scope, $q, AwsS3Service, ModalService, ProfileService, ParameterService) {

      var ctrl = this;
      ctrl.maxFileSize = 0;
      ctrl.deleteItem = ModalService.portfolioItemToDelete;
      ctrl.showItem = ModalService.portfolioItemToShow;

      ParameterService.getPortfolioTypes().then(
        function(){ },
        function () { }
      );

        $scope.image = {
          originalImage: '',
          croppedImage: ''
        };

        var handleFileSelect=function(evt) {
          var file=evt.currentTarget.files[0];
          var reader = new FileReader();
          reader.onload = function (evt) {
            $scope.$apply(function($scope){
              $scope.image.originalImage=evt.target.result;
            });
          };
          reader.readAsDataURL(file);
        };

        $scope.fileNameChangedImage = function (ele) {
          var files = ele.files;

          ctrl.file = files[0];
          var reader = new FileReader();
          reader.onload = function () {
            $scope.$apply(function($scope){
              $scope.image.originalImage=reader.result;
            });
          };
          reader.readAsDataURL(ctrl.file);
        };

        $scope.fileNameChanged = function (ele) {
          var files = ele.files;

          ctrl.file = files[0];
          var reader = new FileReader();
          reader.onload = function () {
            $scope.$apply(function($scope){
              $scope.image.originalImage=reader.result;
            });
          };
        };

        angular.element('.fileInputPortfolio').on('change',handleFileSelect);

        function uploadFileItem(portTypeId) {
          if(ctrl.file.size <= ctrl.maxFileSize){
            ctrl.showSpinner = true;
            AwsS3Service.uploadPorfolioFile(ctrl.file, portTypeId, ctrl.title, ctrl.description, ctrl.url).then(
              function () { ctrl.showSpinner = false; ctrl.cancel(); },
              function () { ctrl.showSpinner = false; ModalService.showErrorTryAgain(); }
            );
          }
          else{
            ModalService.showSimpleNotification('El temaño de archivo es mayor al permitido!');
          }
        }

        function uploadLinkItem(portTypeId) {
          ctrl.showSpinner = true;
          ProfileService.addPortfolioItem(portTypeId, ctrl.title, ctrl.description, ctrl.url, 0).then(
            function() { ctrl.showSpinner = false; ctrl.cancel(); },
            function(){ ctrl.showSpinner = false; ModalService.showErrorTryAgain(); }
          );
        }

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

        ctrl.saveItem = function () {
        if(angular.isUndefined(ctrl.type) || ctrl.type === null){
          ModalService.showSimpleNotification('Debes seleccinar un tipo!');
        }
        else{
          ParameterService.getPortfolioTypeIdFromName(ctrl.type).then(function (portType) {
            switch (ctrl.type) {
              case 'Image':
                if($scope.image.originalImage !== '' &&  $scope.image.croppedImage !== ''){
                  // Primero tengo que hacer el upload del porfolio y luego hacer el agregado de la vista previa
                  ctrl.showSpinner = true;
                  AwsS3Service.uploadPorfolioImageWithPreview(ctrl.file, dataURItoBlob($scope.image.croppedImage), portType.id, ctrl.title, ctrl.description, ctrl.url).then(
                    function () { ctrl.showSpinner = false; ctrl.cancel(); },
                    function () { ctrl.showSpinner = false; ModalService.showErrorTryAgain();
                  });
                }
                break;
              case 'Video':
                uploadLinkItem(portType.id);
                break;
              case 'Audio':
                if(angular.isDefined(ctrl.file) && ctrl.file !== null){
                  if(ctrl.file.type === 'audio/mp3' || ctrl.file.type === 'audio/mpeg'){ uploadFileItem(portType.id);}
                  else{  ModalService.showSimpleNotification('Solo se permiten audios en formato mp3'); }
                }
                else if(angular.isDefined(ctrl.url) && ctrl.url !== null){ uploadLinkItem(portType.id); }
                break;
              case 'Other':
                if(angular.isDefined(ctrl.file) && ctrl.file !== null){ uploadFileItem(portType.id); }
                else{ ModalService.showSimpleNotification('Por favor selecciona un archivo para subir'); }
                break;
            }
          });
        }
      };

      ctrl.cancel = function () {
        $uibModalInstance.close(ctrl);
      };

      ctrl.confirmDelete = function () {
        ProfileService.deletePortfolioItem(ctrl.deleteItem.userPortfolioId).then(
          function () { ctrl.cancel(); },
          function () {ModalService.showErrorTryAgain(); }
        );
      };

      ctrl.typeChanged = function () {
        ctrl.title = null;
        ctrl.url = '';
        ctrl.description = null;
        $scope.image.originalImage = null;
        switch (ctrl.type) {
          case 'Image': ctrl.maxFileSize = 10485760; break;
          case 'Video': ctrl.maxFileSize = 0; break;
          case 'Audio': ctrl.maxFileSize = 20971520; break;
          case 'Other': ctrl.maxFileSize = 10485760; break;
        }
      };

    }]);
})();
