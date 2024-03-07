(function() {

  'use strict';

  angular.module('rombusYeoApp').controller('ContactModalCtrl', ['$uibModalInstance', '$scope', 'ModalService',
    'SpecAreaService', 'ContactService', 'ProfileService', 'UserService', 'GroupService', 'BroadcastService',
    function($uibModalInstance, $scope, ModalService, SpecAreaService, ContactService, ProfileService, UserService, GroupService,BroadcastService){

      var ctrl = this;
      ctrl.basicInfo = ProfileService.basicInfo;
      ctrl.groupInfo = ModalService.group;
      ctrl.memberInfo = ModalService.member;

      if(angular.isDefined(ctrl.groupInfo) && angular.isDefined(ctrl.groupInfo.userGroup) && ctrl.groupInfo.userGroup.length > 0){
        for(var i = 0; i < ctrl.groupInfo.userGroup.length; i++){
          if(ctrl.groupInfo.userGroup[i].user.userId === ctrl.groupInfo.ownerId){
            ctrl.ownerName = ctrl.groupInfo.userGroup[i].user.fullName;
            break;
          }
        }
      }

      ctrl.ok = function () {
        $uibModalInstance.close(ctrl);
      };

      if(UserService.isLogged === true && UserService.email !== null) {
        ctrl.isLogged = true;
        ctrl.userName = '';
        ctrl.userMail = UserService.email;
      }

      ctrl.confirmContract = function () {
        var userId = ctrl.isLogged === true ? UserService.userId : null;
        ContactService.sendContactUser('contract', userId, ctrl.userName, ctrl.userMail, ctrl.basicInfo.userId, ctrl.message).then(
          function () { ctrl.ok(); ModalService.showSimpleNotification('¡El mensaje ha sido enviado exitosamente!'); },
          function () { ctrl.ok(); ModalService.showErrorTryAgain(); }
        );
      };

      ctrl.reportUser = function () {
        var userId = ctrl.isLogged === true ? UserService.userId : null;
        ContactService.sendContactUser('report', userId, ctrl.userName, ctrl.userMail, ctrl.basicInfo.userId, ctrl.message).then(
          function () { ctrl.ok(); ModalService.showSimpleNotification('¡El mensaje ha sido enviado exitosamente!'); },
          function () { ctrl.ok(); ModalService.showErrorTryAgain(); }
        );
      };

      ctrl.sendInviteUser = function () {
        GroupService.inviteUser(ctrl.basicInfo.userId, ctrl.groupInfo.groupId, ctrl.groupInfo.ownerId ).then(
          function () { ctrl.ok(); BroadcastService.rootScopeBroadcast('groupInviteSent', ctrl.groupInfo); },
          function() { ModalService.showErrorTryAgain(); }
        );
      };

      ctrl.sendRequestGroupPermission = function () {
        GroupService.requestGroupPermission(UserService.userId, ctrl.groupInfo.groupId, ctrl.groupInfo.ownerId).then(
          function () { ctrl.ok(); BroadcastService.rootScopeBroadcast('groupRequestPermissionSent', ctrl.groupInfo); },
          function () { ModalService.showErrorTryAgain(); }
        );
      };

      ctrl.removeGroupMember = function () {
        GroupService.removeMember(ctrl.memberInfo.participantId, ctrl.memberInfo.user.userId, ctrl.groupInfo.groupId, ctrl.groupInfo.ownerId).then(
          function (response) {
            if(angular.isDefined(response.data) && angular.isDefined(response.data.resultOk) && response.data.resultOk === true){
              for(var i = 0; i < ctrl.groupInfo.userGroup.length; i++){
                if(ctrl.groupInfo.userGroup[i].participantId === ctrl.memberInfo.participantId){
                  ctrl.groupInfo.userGroup.splice(i,1);
                  break;
                }
              }
            }
            ctrl.ok();
          },
          function () { ModalService.showErrorTryAgain(); }
        );
      };

      ctrl.removeMyself = function () {
        ctrl.userGroupParticipant = ModalService.userGroupParticipant;
        GroupService.removeMyself(ctrl.groupInfo.groupId, ctrl.groupInfo.ownerId).then(
          function() {
            for(var i = 0; i < ctrl.userGroupParticipant.length; i++){
              if(ctrl.userGroupParticipant[i].groupId === ctrl.groupInfo.groupId){
                ctrl.userGroupParticipant.splice(i,1);
              }
            }
            ctrl.ok();
          },
          function() { ModalService.showErrorTryAgain(); }
        );
      };

      ctrl.closeGroup = function () {
        GroupService.closeGroup(ctrl.groupInfo.groupId).then(
          function () { ctrl.ok(); BroadcastService.rootScopeBroadcast('userGroupClosed',[]); },
          function () { console.log('Problemas cerrando grupo'); }
        );
      };

    }]);
})();
