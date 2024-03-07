(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:SideBarCtrl
   * @description
   * # SideBarCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('SideBarCtrl', [ '$scope', '$location', '$rootScope', '$routeParams', '$filter', 'ModalService', 'ProfileService', 'ParameterService', 'GroupService', 'NotificationService', 'UserService', 'AwsS3Service', 'CountryPickerService', 'SpecAreaService',
      function ($scope, $location, $rootScope, $routeParams, $filter, ModalService, ProfileService, ParameterService, GroupService, NotificationService, UserService, AwsS3Service, CountryPickerService, SpecAreaService) {

        var ctrl = this;
        // 0 = View and 1 = Edit
        ctrl.modeMain = 0;
        ctrl.modeSidePrice = 0;
        ctrl.userGroups = [];
        ctrl.receiveNotifications = [];
        ctrl.sentNotifications = [];
        ctrl.canCreateGroup = false;
        ctrl.canInviteToGroup = false;
        ctrl.canPresentSelf = false;
        ctrl.startEditingGroup = false;
        ctrl.inviteSent = false;
        ctrl.userGroups = [];
        ctrl.userGroupParticipant = [];
        ctrl.nameForGroups = '';
        ctrl.tempGroupName = '';
        ctrl.sessionGroups = {userGroups: [], userGroupParticipant: []};
        ctrl.sessionNotif = {receiveNotifications: [], sentNotifications: []};
        ctrl.membership = null;
        ctrl.userFunction = null;

        function updateSpecAreas() {
          SpecAreaService.getUserSpecAreas().then(
            function(response){
              if(response.mainspecialityid !== null && response.mainspecialityid !== undefined){
                ParameterService.getSpecAreaNameFromId(response.mainspecialityid).then(
                  function (response1) {
                    ctrl.specArea1 = response1;
                  }
                );
              }
              else{
                ctrl.specArea1 = undefined;
              }
              if(response.secondaryspecialityid !== null && response.secondaryspecialityid !== undefined){
                ParameterService.getSpecAreaNameFromId(response.secondaryspecialityid).then(
                  function (response2) {
                    ctrl.specArea2 = response2;
                  }
                );
              }
              else{
                ctrl.specArea2 = undefined;
              }
            }
          );
        }

        function isMemberInGroup (grp, userId) {
          for(var i = 0; i < grp.userGroup.length; i++){
            if(grp.userGroup[i].user.userId.toString() === userId.toString()){
              return true;
            }
          }
          return false;
        }

        function checkCanInviteToGroup() {
          return ctrl.sessionMembership.groupowner === 1 && ctrl.sessionGroups.userGroups.length > 0 && !isMemberInGroup(ctrl.sessionGroups.userGroups[0], UserService.otherUserId) && ctrl.sessionGroups.userGroups[0].userGroup.length < 12;
        }

        function updateSessionGroups() {
          ProfileService.getUserGroups(true).then(
            function (response) {
              angular.forEach(response.userGroups,function (grp) {
                if(grp.ownerId === UserService.userId){ ctrl.sessionGroups.userGroups.push(grp); }
                else{ ctrl.sessionGroups.userGroupParticipant.push(grp); }
              });
              UserService.getUserMembership().then(
                function (response) {
                  try{
                    ctrl.sessionMembership = response;
                    ctrl.canPresentSelf = (ctrl.sessionMembership.groupparticipantamount > ctrl.sessionGroups.userGroupParticipant.length);
                    ctrl.canInviteToGroup = checkCanInviteToGroup();
                  } catch(err) {
                    ctrl.canPresentSelf = false; ctrl.canInviteToGroup = false;
                  }
                },
                function () { ctrl.canPresentSelf = false; ctrl.canInviteToGroup = false; }
              );
            },
            function () {
              ctrl.sessionGroups = {userGroups: [], userGroupParticipant: []};
              ctrl.canInviteToGroup = false;
              ctrl.canPresentSelf = false;
            }
          );
        }

        function updateSessionNotif() {
          ProfileService.getUserNotifications(true).then(
            function (response) {
              ctrl.sessionNotif.receiveNotifications = response.receiveNotifications;
              ctrl.sessionNotif.sentNotifications = response.sentNotifications;
            },
            function () {
              ctrl.sessionNotif = {receiveNotifications: [], sentNotifications: []};
            }
          );
        }

        function updateProfilePicture() {
          if(ctrl.isSelfUser === true){
            AwsS3Service.getProfilePicture(true).then(
              function (response) { ctrl.userPicture = response; },
              function () { ctrl.userPicture = null;}
            );
          }
          else{
            AwsS3Service.getOtherUserProfPicture().then(
              function (response) { ctrl.userPicture = response; },
              function () { ctrl.userPicture = null; }
            );
          }
        }

        function processBasicInfo(basicInfo) {
          let memberSince = Date.parse(basicInfo.memberSince,'yyyy-mm-dd hh-MM-ss')
          ctrl.firstName = basicInfo.name;
          ctrl.lastName = basicInfo.surname;
          ctrl.fullName = ctrl.firstName + " " + ctrl.lastName;
          ctrl.jobTitle = basicInfo.specialityDescr;
          ctrl.location = basicInfo.location;

          ctrl.country = CountryPickerService.getCountryNameFromCode(basicInfo.country);
          ctrl.memberSince = memberSince;
          ctrl.phone = basicInfo.cellphone;
          ctrl.address = basicInfo.address;
          ctrl.companyJobTitle = basicInfo.companyJobTitle;
        }

        function updateAvgCompleted() {
          ProfileService.getAvgCompleted().then(
            function (response) {ctrl.percentProfCompleted = response.avgcompleted; },
            function () { ctrl.percentProfCompleted = 0; }
          );
        }

        function blankGroupsAndCreate(){
          ctrl.userGroups = [];
          ctrl.userGroupParticipant = [];
          ctrl.canCreateGroup = false;
          ctrl.canInviteToGroup = false;
          ctrl.membership = null;
          ctrl.userFunction = null;
        }
        function processGroups(response) {
          ProfileService.getBasicInfo().then(
            function(){ ctrl.nameForGroups = ctrl.isSelfUser === true ? '' : ProfileService.basicInfo.name; },
            function() { ctrl.nameForGroups = ''; }
          );
          ctrl.userGroups = [];
          ctrl.userGroupParticipant = [];
          angular.forEach(response.userGroups, function (grp) {
            var userId = ctrl.isSelfUser === true ? UserService.userId : UserService.otherUserId;
            if(grp.ownerId.toString() === userId.toString()){
              ProfileService.getBasicInfo().then(
                function(){ grp.nameForGroup = ProfileService.basicInfo.name; }
              );
              if(ctrl.startEditingGroup === true){
                grp.editable = true;
                ctrl.tempGroupName = grp.name !== undefined ? grp.name : '';
              }
              if(ctrl.isSelfUser === true || grp.userGroup.length > 2){
                ctrl.userGroups.push(grp);
              }
            }
            else{
              if(grp.userGroup.length > 2){
                ctrl.userGroupParticipant.push(grp);
                if(grp.name === undefined){
                  for(var m = 0; m < grp.userGroup.length; m++){
                    if(grp.userGroup[m].user.userId === grp.ownerId){
                      grp.nameForGroup = grp.userGroup[m].user.name;
                    }
                  }
                }
              }
            }
            for(var i = 0; i < grp.userGroup.length; i++){
              if(grp.userGroup[i].user.userId.toString() === userId.toString()){
                grp.userGroup.splice(i,1);
                break;
              }
            }
          });
          ctrl.canCreateGroup = ctrl.userGroups.length < ctrl.membership.usergroupsamount;
        }
        function updateGroups() {
          if(angular.isDefined(ctrl.membership) && angular.isDefined(ctrl.membership.usergroupsamount) && ctrl.membership.usergroupsamount > 0){
            ProfileService.getUserGroups(ctrl.isSelfUser).then(
              function(response){ processGroups(response); },
              function () { blankGroupsAndCreate(); }
            );
          }
          else{ blankGroupsAndCreate(); }
        }
        function processMembership(membership) {
          ctrl.membership = membership;
          if(angular.isDefined(ctrl.membership) && angular.isDefined(ctrl.membership.id)){
            setMembershipIcon(ctrl.membership.id);
          }
        }

        function updateUserNotifications() {
          ProfileService.getUserNotifications(false).then(
            function(response){
              ctrl.receiveNotifications = response.receiveNotifications;
              ctrl.sentNotifications = response.sentNotifications;
            },
            function () {
              ctrl.receiveNotifications = [];
              ctrl.sentNotifications = [];
            }
          );
        }
        function removeCompletedNotification(notif) {
          for(var i = 0; i < ctrl.receiveNotifications.length; i++){
            if(ctrl.receiveNotifications[i].notificationId === notif.notificationId){
              ctrl.receiveNotifications.splice(i,1);
            }
          }
        }

        function setMembershipIcon(id) {
          switch (id) {
            case 1:
              ctrl.membershipIcon = '../../images/m-registrado.svg';
              break;
            case 2:
              ctrl.membershipIcon = '../../images/m-acreditado.svg';
              break;
            case 3:
              ctrl.membershipIcon = '../../images/m-premium.svg';
              break;
          }
        }
        function setFunctionIcon(id) {
          switch (id) {
            case 1:
              ctrl.functionIcon = '../../images/icon-corporativo.svg';
              break;
            case 2:
              ctrl.functionIcon = '../../images/icon-manager.svg';
              break;
            case 3:
              ctrl.functionIcon = '../../images/icon-coworker.svg';
              break;
            case 4:
              ctrl.functionIcon = '../../images/icon-representante.svg';
              break;
          }
        }

        // This needs to be the first evaluation to set the flag for service calls
        if($location.url() === '/profile' || $location.url() === '/dashboard'){
          ctrl.isSelfUser = true;
          UserService.isSelfUser = true;
          UserService.otherUserId = null;
        }
        else{
          UserService.otherUserId = $routeParams.id;
          UserService.isSelfUser = false;
          ctrl.isSelfUser = UserService.isSelfUser;
          updateSessionGroups();
          updateSessionNotif();
        }

        // Init operations needed
        updateSpecAreas();
        updateProfilePicture();
        updateAvgCompleted();
        updateUserNotifications();

        ParameterService.initProfileParams();

        ProfileService.getBasicInfo().then(
          function(response) { processBasicInfo(response); },
          function() { ModalService.showErrorTryAgain(); }
        );

        ProfileService.getPricePerHour().then(
          function (response) { ctrl.hourPrice = response.amountperhour; },
          function () { ModalService.showErrorTryAgain(); }
        );

        ProfileService.getMembership().then(
          function (response) {
            ParameterService.getUserMembershipsById(response.membershipid).then(
              function (response) {
                processMembership(response);
                updateGroups();
              }
            );
          },
          function () { blankGroupsAndCreate(); }
        );
        ProfileService.getUserFunction().then(
          function (response) {
            ParameterService.getUserFunctionById(response.functionid).then(
              function (response) {
                ctrl.userFunction = response;
                if(angular.isDefined(ctrl.userFunction) && angular.isDefined(ctrl.userFunction.id)){
                  setFunctionIcon(ctrl.userFunction.id);
                }
              }
            );
          },
          function () { }
        );

        ctrl.toggleMain = function () {
          if(ctrl.modeMain === 0){
            ctrl.tempFirstName = ctrl.firstName;
            ctrl.tempLastName = ctrl.lastName;
            ctrl.tempJobTitle = ctrl.jobTitle;
            ctrl.tempLocation = ctrl.location;
            ctrl.tempCountry = ctrl.country;
            ctrl.tempPhone = ctrl.phone;
            ctrl.tempAddress = ctrl.address;
            ctrl.modeMain = 1;
          }
          else{
            ctrl.modeMain = 0;
          }
        };

        ctrl.toggleSpecAreas = function () {
          ModalService.showSpecAreas();
        };

        ctrl.togglePicture = function () {
          ModalService.showProfilePicture();
        };

        ctrl.saveBasicInfo = function () {
          ProfileService.updateBasicInfo(ctrl.tempFirstName, ctrl.tempLastName, ctrl.tempJobTitle, ctrl.tempLocation,
            CountryPickerService.getCountryCodeFromName(ctrl.tempCountry), ctrl.phone, ctrl.address, ctrl.companyJobTitle).then(
            function () {
              ctrl.firstName = ctrl.tempFirstName;
              ctrl.lastName = ctrl.tempLastName;
              ctrl.jobTitle = ctrl.tempJobTitle;
              ctrl.location = ctrl.tempLocation;
              ctrl.country = ctrl.tempCountry;
              ctrl.modeMain = 0;
            },
            function () {
              ModalService.showSimpleNotification('Se ha producido un error, por favor intente nuevamente');
            }
          );


        };

        ctrl.checkPresentMyself = function(grp) {
          try{
            if(ctrl.isSelfUser !== true && ctrl.canPresentSelf === true && grp.userGroup.length > 1 && grp.requestSent !== true){
              for(var i = 0; i < grp.userGroup.length; i++){
                if(grp.userGroup[i].user.userId.toString() === UserService.userId.toString()){
                  return false;
                }
              }
              for(var j = 0; j < ctrl.sessionNotif.sentNotifications.length; j++){
                if(grp.groupId === ctrl.sessionNotif.sentNotifications[j].userGroupId && ctrl.sessionNotif.sentNotifications[j].notificationType === 1){
                  return false;
                }
              }
            }
            else{
              return false;
            }
          } catch (err) { return false; }
          return true;
        };

        ctrl.toggleSidePrice = function () {
          if(ctrl.modeSidePrice === 0){
            ctrl.tempHourPrice = ctrl.hourPrice;
            ctrl.modeSidePrice = 1;
          }
          else{
            ctrl.modeSidePrice = 0;
          }
        };

        ctrl.saveSidePrice = function () {
          ProfileService.updatePricePerHour(ctrl.tempHourPrice, ctrl.percentProfCompleted).then(
            function () {
              ctrl.hourPrice = ctrl.tempHourPrice;
              ctrl.modeSidePrice = 0;
            },
            function () {ModalService.showErrorTryAgain(); }
          );

        };

        ctrl.toggleGroup = function (group) {
          if(angular.isDefined(group)){
            group.editable = true;
            ctrl.tempGroupName = group.name;
          }
          else{ ctrl.isCreatingGroup = true; }
        };

        ctrl.saveGroupChanges = function (group) {
          if(angular.isDefined(ctrl.tempGroupName) && ctrl.tempGroupName.length > 20){
            ModalService.showSimpleNotification('El nombre del grupo no puede superar los 20 caracteres!');
          }
          else if(ctrl.tempGroupName !== group.name){
            GroupService.updateGroupName(group.groupId, ctrl.tempGroupName).then(
              function (response) {
                if(angular.isDefined(response.data) && angular.isDefined(response.data.resultOk)){
                  if(response.data.resultOk === true){
                    group.name = ctrl.tempGroupName;
                    group.editable = false;
                  }
                  else{ ModalService.showErrorTryAgain(); }
                }
                else { ModalService.showErrorTryAgain(); }
              },
              function () { ModalService.showErrorTryAgain(); }
            );
          }
          else{
            group.editable = false;
          }
        };

        ctrl.discardGroupChanges = function (grp) { grp.editable = false; };

        ctrl.createGroup = function () {
          if(angular.isDefined(ctrl.newGroupName) && ctrl.newGroupName.length > 20){
            ModalService.showSimpleNotification('El nombre del grupo no puede superar los 20 caracteres!');
          }
          else{
            GroupService.createGroup(ctrl.newGroupName).then(
              function() { ctrl.isCreatingGroup = false; ctrl.startEditingGroup = true; updateGroups(); },
              function() { ModalService.showErrorTryAgain(); }
            );
          }
        };

        ctrl.removeGroupMember = function (group, member) {
          ModalService.showSibaRemoveGroupMember(group, member);
        };

        ctrl.removeMeFromGroup = function (group) {
          ModalService.showSibaRemoveMyself(group, ctrl.userGroupParticipant);
        };

        ctrl.closeGroup = function (group) {
          ModalService.showCloseGroup(group);
        };

        ctrl.contractUser = function () {
          ModalService.showSibaContract();
        };

        ctrl.reportUser = function () { ModalService.showSibaReport(); };

        ctrl.inviteUser = function() { ModalService.showSibaInvite(ctrl.sessionGroups.userGroups[0]); };

        ctrl.presentMyself = function (group) { ModalService.showSibaPresentMyself(group); };

        ctrl.replyNotification = function (notif) {
          NotificationService.updateNotification(notif.notificationId, true).then(
            function () { removeCompletedNotification(notif); },
            function () { ModalService.showErrorTryAgain(); }
          );
        };

        ctrl.rejectNotification = function (notif) {
          NotificationService.updateNotification(notif.notificationId, false).then(
            function () { removeCompletedNotification(notif); },
            function () { ModalService.showErrorTryAgain(); }
          );
        };

        ctrl.showUser = function (user) {
          if(user.userId === UserService.userId ){
            $rootScope.changeViewWithSpecElement('profile','');
          }
          else{
            $rootScope.changeViewWithSpecElement('profile/users/'+user.userId, '');
          }
        };

        ctrl.showGroupOwner = function (group) {
          if(group.ownerId === UserService.userId ){
            $rootScope.changeViewWithSpecElement('profile','');
          }
          else{
            $rootScope.changeViewWithSpecElement('profile/users/'+group.ownerId, '');
          }
        };

        ctrl.isGroupOwner = function (group) { return group.ownerId === UserService.userId; };

        // Listeners
        $rootScope.$on('profPicUpdated', function () {
          updateProfilePicture();
        });

        $rootScope.$on('userAvgUpdated', function () {
          updateAvgCompleted();
        });

        $rootScope.$on('groupRequestPermissionSent', function (event, group) {
          group.requestSent = true;
        });

        $rootScope.$on('groupInviteSent', function () {
          ctrl.inviteSent = true;
        });

        $rootScope.$on('userGroupClosed', function () {
          updateGroups();
        });

        $rootScope.$on('updateNotifications', function () {
          updateUserNotifications();
        });

        $rootScope.$on('specAreasUpdated',function () {
          updateSpecAreas();
        });

      }]);
})();

