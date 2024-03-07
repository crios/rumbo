(function (){

  'use strict';

  angular.module('rombusYeoApp').service('ModalService', [ '$uibModal', '$translate', function($uibModal, $translate) {

    var modalService = this;

    modalService.messageType = '';
    modalService.message = '';
    modalService.portfolioItemToDelete = null;
    modalService.portfolioItemToShow = null;
    modalService.message1 = null;
    modalService.message2 = null;
    modalService.contactOption = null;
    modalService.contactModalRequested = false;

    modalService.showSimpleNotification = function (message) {

      modalService.message = message;
      var instance =  $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/notificationSimple.html',
        controller: 'ModalInstanceCtrl as modal',
        size: 'sm'
      });

      instance.result.then(
        function () { /* ADD CLOSE INSTRUCTIONS HERE */ },
        function () { /* ADD DISMISS INSTRUCTIONS HERE*/ });
      return instance.result;
    };

    modalService.showErrorTryAgain = function () {
      modalService.showSimpleNotification('Se ha producido un error, por favor intente nuevamente!');
    };

    modalService.showMultipleErrorMessages = function (errorMessages){
      modalService.errorMessages = errorMessages;
      var instance =  $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/multipleErrorMessages.html',
        controller: 'ModalInstanceCtrl as modal',
        size: 'md'
      });

      instance.result.then(
        function () { modalService.errorMessages = null; },
        function () { modalService.errorMessages = null; });
      return instance.result;
    };

    modalService.showContact = function (contactOption) {

      modalService.contactOption = contactOption;
      modalService.contactModalRequested = true;
      var instance =  $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/contactUsModal.html',
        controller: 'ContactUsCtrl as modal',
        size: 'lg'
      });

      instance.result.then(
        function () { modalService.contactOption = null; modalService.contactModalRequested = false; },
        function () { modalService.contactOption = null; modalService.contactModalRequested = false; });
    };

    modalService.showSkills = function (){
      var instance =  $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/skillsModal.html',
        controller: 'ModalInstanceCtrl as modal',
        size: 'lg'
      });

      instance.result.then(
        function () { /* ADD CLOSE INSTRUCTIONS HERE */ },
        function () { /* ADD DISMISS INSTRUCTIONS HERE*/ });
    };

    modalService.showSpecAreas = function () {
      var instance =  $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/specAreasModal.html',
        controller: 'ModalInstanceCtrl as modal',
        size: 'lg'
      });

      instance.result.then(
        function () { /* ADD CLOSE INSTRUCTIONS HERE */ },
        function () { /* ADD DISMISS INSTRUCTIONS HERE*/ });
    };

    modalService.showPortfolio = function () {
      var instance =  $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/portfolioModal.html',
        controller: 'PortfolioCtrl as portfolio',
        size: 'lg'
      });

      instance.result.then(
        function () { /* ADD CLOSE INSTRUCTIONS HERE */ },
        function () { /* ADD DISMISS INSTRUCTIONS HERE*/ });
    };

    modalService.confirmPortfolioDelete = function (item) {
      modalService.portfolioItemToDelete  = item;
      var instance =  $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/portfolioDeleteConfirm.html',
        controller: 'PortfolioCtrl as portfolio',
        size: 'medium'
      });

      instance.result.then(
        function () { /* ADD CLOSE INSTRUCTIONS HERE */ },
        function () { /* ADD DISMISS INSTRUCTIONS HERE*/ });
    };

    modalService.showPortfolioItem = function (item) {
      modalService.portfolioItemToShow = item;
      var instance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/portfolioItem.html',
        controller: 'PortfolioCtrl as portfolio',
        size: 'lg'
      });
      instance.result.then(
        function () { /* ADD CLOSE INSTRUCTIONS HERE */ },
        function () { /* ADD DISMISS INSTRUCTIONS HERE*/ });
    };

    modalService.showProfilePicture = function () {
      var instance =  $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/profilePictureModal.html',
        controller: 'ProfilePictureCtrl as profPicture',
        size: 'lg'
      });

      instance.result.then(
        function () { /* ADD CLOSE INSTRUCTIONS HERE */ },
        function () { /* ADD DISMISS INSTRUCTIONS HERE*/ });
    };

    modalService.showUploadLogo= function () {
      var instance =  $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/uploadLogoModal.html',
        controller: 'UploadLogoCtrl as logo',
        size: 'lg'
      });

      instance.result.then(
        function () { /* ADD CLOSE INSTRUCTIONS HERE */ },
        function () { /* ADD DISMISS INSTRUCTIONS HERE*/ });
    };

    modalService.showSibaContract = function () {
      var instance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/sideBarContractUser.html',
        controller: 'ContactModalCtrl as sibaModal',
        size: 'siba'
      });
      instance.result.then(
        function () { /* ADD CLOSE INSTRUCTIONS HERE */ },
        function () { /* ADD DISMISS INSTRUCTIONS HERE*/ });
    };

    modalService.showSibaReport = function () {
      var instance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/sideBarReportUser.html',
        controller: 'ContactModalCtrl as sibaModal',
        size: 'siba'
      });
      instance.result.then(
        function () { /* ADD CLOSE INSTRUCTIONS HERE */ },
        function () { /* ADD DISMISS INSTRUCTIONS HERE*/ });
    };

    modalService.showSibaInvite = function (group) {
      modalService.group = group;
      var instance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/sideBarInviteUser.html',
        controller: 'ContactModalCtrl as sibaModal',
        size: 'siba'
      });
      instance.result.then(
        function () { modalService.group = null; },
        function () { modalService.group = null; });
    };

    modalService.showSibaPresentMyself = function (group) {
      modalService.group = group;
      var instance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/sideBarPresentMyself.html',
        controller: 'ContactModalCtrl as sibaModal',
        size: 'siba'
      });
      instance.result.then(
        function () { modalService.group = null; },
        function () { modalService.group = null; });
    };

    modalService.showSibaRemoveGroupMember = function (group, member) {
      modalService.group = group;
      modalService.member = member;
      var instance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/sideBarRemoveGroupMember.html',
        controller: 'ContactModalCtrl as sibaModal',
        size: 'siba'
      });
      instance.result.then(
        function () { modalService.group = null; modalService.member = null; },
        function () { modalService.group = null; modalService.member = null; });
    };

    modalService.showSibaRemoveMyself = function (group, userGroupParticipant) {
      modalService.group = group;
      modalService.userGroupParticipant = userGroupParticipant;
      var instance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/sideBarRemoveMyself.html',
        controller: 'ContactModalCtrl as sibaModal',
        size: 'siba'
      });
      instance.result.then(
        function () { modalService.group = null; modalService.userGroupParticipant = null; },
        function () { modalService.group = null; modalService.userGroupParticipant = null; });
    };

    modalService.showCloseGroup = function (group) {
      modalService.group = group;
      var instance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/sideBarCloseGroup.html',
        controller: 'ContactModalCtrl as sibaModal',
        size: 'siba'
      });
      instance.result.then(
        function () { modalService.group = null; },
        function () { modalService.group = null; });
    };

    modalService.showReactivateAccount = function (message1, message2, userEmail) {
      modalService.message1 = message1;
      modalService.message2 = message2;
      modalService.userEmail = userEmail;
      var instance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/reactivateAccountConfirmation.html',
        controller: 'ModalInstanceCtrl as modal',
        size: 'siba'
      });
      instance.result.then(
        function () { /* ADD CLOSE INSTRUCTIONS HERE */ },
        function () { /* ADD DISMISS INSTRUCTIONS HERE*/ });
    };

    modalService.confirmWPUserApplication = function () {
      modalService.message = $translate.instant('modals.confirmUserApplication');
      var instance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/defaultConfirmation.html',
        controller: 'ModalInstanceCtrl as modal',
        size: 'siba'
      });
      instance.result.then(
        function () { modalService.message = null; },
        function () { modalService.message = null; });
      return instance.result;
    };

    modalService.defaultConfirmation = function (message, showCannotUndo) {
      modalService.message = message;
      modalService.showCannotUndo = showCannotUndo;
      var instance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/defaultConfirmation.html',
        controller: 'ModalInstanceCtrl as modal',
        size: 'siba'
      });
      instance.result.then(
        function () { modalService.message = null; modalService.showCannotUndo = null;},
        function () { modalService.message = null; modalService.showCannotUndo = null;});
      return instance.result;
    };

  }]);
})();
