(function() {

  'use strict';

  angular.module('rombusYeoApp').controller('SkillsCtrl', ['$q', '$scope', '$rootScope', 'SkillService', 'UserService', 'ParameterService', 'BroadcastService', 'ProfileService', 'ModalService',
    function($q, $scope, $rootScope, SkillService, UserService, ParameterService, BroadcastService, ProfileService, ModalService){

      var ctrl = this;
      ctrl.maxAmount = 5;

      function updateUserSkill() {
        SkillService.getUserSkills().then(
          function (response) { ctrl.userSkills = response.skills; },
          function () {  });
      }

      function processMembership (membership){
        ParameterService.getUserMembershipsById(membership.membershipid).then(
          function (response) {
            if(angular.isDefined(response.skillsamount)){
              ctrl.maxAmount = response.skillsamount;
            }
          },
          function() { ctrl.maxAmount = 5; }
        );
      }

      // Init
      $q.all([
        ParameterService.getSkills(),
        ProfileService.getMembership(),
        updateUserSkill()
      ]).then(
        function (values) {
          ctrl.list = values[0];
          processMembership(values[1]);
        },
        function(){
          ctrl.list = [];
          ctrl.maxAmount = 5;
        }
      );

      ctrl.addSkill = function (skill, directly) {

        if(ctrl.userSkills.length < ctrl.maxAmount){
          if(angular.isDefined(skill)){
            var temp = skill.originalObject;
            var obj = ctrl.userSkills.filter(function(s) {
              return s.id === temp.id;
            });

            $scope.$broadcast('angucomplete-alt:clearInput', 'ex1');

            if(obj.length === 0){
              if(!directly){
                ctrl.userSkills.push(temp);
                SkillService.skillsToAdd.push(temp);
              }
              else{
                SkillService.addSkill(temp).then(
                  function () { },
                  function () { ModalService.showErrorTryAgain(); }
                );
              }

            }
          }
          else{
            ModalService.showSimpleNotification('Por favor introduzca una habilidad válida');
          }
        }
        else{
          ModalService.showSimpleNotification('Ha alcanzado el limite de habilidades para su membresía');
        }
      };

      ctrl.deleteSkill = function (skill, directly) {
        for(var i = ctrl.userSkills.length - 1; i >= 0; i--){
          if(ctrl.userSkills[i].description === skill.description){
            if(!directly){
              ctrl.userSkills.splice(i,1);
              SkillService.skillsToDelete.push(skill);
            }
            else {
              SkillService.deleteSkill(skill);
            }
          }
        }
      };

      $rootScope.$on('skillsUpdated', function () {
        updateUserSkill();
        BroadcastService.rootScopeBroadcast('userAvgUpdated', {});
      });

    }]);
})();
