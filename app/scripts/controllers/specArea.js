(function() {

  'use strict';

  angular.module('rombusYeoApp').controller('SpecAreaCtrl', ['$q', '$rootScope', 'ParameterService', 'SpecAreaService', 'ProfileService',
    function($q, $rootScope, ParameterService, SpecAreaService, ProfileService){

      var ctrl = this;
      ctrl.maxAmount = 1;

      $rootScope.specAreasModel = { mkt: false, pub: false, dev: false, des: false, pre: false };

      $rootScope.specAreasSelected = [];

      function updateUserSpecAreas() {
        SpecAreaService.getUserSpecAreas().then(function (response) {
          $rootScope.specAreasSelected = [];
          if(angular.isDefined(response.mainspecialityid) && response.mainspecialityid !== null && response.mainspecialityid !== 1){
            SpecAreaService.spec1 = response.mainspecialityid;
            ctrl.loadExistingSpecArea($rootScope, response.mainspecialityid);
          }
          else{
            SpecAreaService.spec1 = undefined;
          }
          if(angular.isDefined(response.secondaryspecialityid) && response.secondaryspecialityid !== null && response.secondaryspecialityid !== 1){
            SpecAreaService.spec2 = response.secondaryspecialityid;
            ctrl.loadExistingSpecArea($rootScope, response.secondaryspecialityid);
          }
          else{
            SpecAreaService.spec2 = undefined;
          }
        });
      }

      function getSpecAreaIdFromType(spec) {
        var id;
        angular.forEach(ctrl.specAreaList, function (obj) {
          if(obj.type === spec){
            id = obj.id;
          }
        });
        return id;
      }

      function processMembership(response){
        ParameterService.getUserMembershipsById(response.membershipid).then(
          function (response1) {
            if(angular.isDefined(response1.specialitiesamount)){
              ctrl.maxAmount = response1.specialitiesamount;
            }
            else { ctrl.maxAmount = 1; }
          },
          function() { ctrl.maxAmount = 1; }
        );
      }

      // Init
      $q.all([
        ProfileService.getMembership(),
        updateUserSpecAreas()
      ]).then(
        function (values) { processMembership(values[0]); },
        function () { ctrl.maxAmount = 1; }
      );

      ctrl.loadExistingSpecArea = function ($rootScope, sa) {
        switch (sa) {
          case 2: $rootScope.specAreasModel.mkt = true; break;
          case 3: $rootScope.specAreasModel.des = true; break;
          case 4: $rootScope.specAreasModel.dev = true; break;
          case 5: $rootScope.specAreasModel.pub = true; break;
          case 6: $rootScope.specAreasModel.pre = true; break;
        }
        $rootScope.specAreasSelected.push(sa);
      };

      ParameterService.getSpecAreas().then(function (response) {
        ctrl.specAreaList = response;
      });

      ctrl.specAreaSelected = function (specArea) {

        // UPDATE THE ITEMS STATUS FOR VIEW
        $rootScope.specAreasSelected = [];
        angular.forEach($rootScope.specAreasModel, function (value, key) {
          if (value) {
            $rootScope.specAreasSelected.push(key);
          }
        });

        // ASSIGN VALUES FOR SPEC1 and SPEC2
        if($rootScope.specAreasSelected.length > 0) {
          if (SpecAreaService.spec1 === null || SpecAreaService.spec1 === undefined) {
            SpecAreaService.spec1 = getSpecAreaIdFromType(specArea);
          }
          else {
            if(SpecAreaService.spec1 === getSpecAreaIdFromType(specArea)){
              SpecAreaService.spec1 = null;
            }
            else {
              if (SpecAreaService.spec2 === null || SpecAreaService.spec2 === undefined) {
                SpecAreaService.spec2 = getSpecAreaIdFromType(specArea);
              } else if (SpecAreaService.spec2 === getSpecAreaIdFromType(specArea)){
                SpecAreaService.spec2 = null;
              }
            }
          }
        }
        else {
          SpecAreaService.spec1 = null;
          SpecAreaService.spec2 = null;
        }
      };

      $rootScope.$on('profileEditionCancelled', function () {
        $rootScope.specAreasModel.mkt = false;
        $rootScope.specAreasModel.pub = false;
        $rootScope.specAreasModel.dev =  false;
        $rootScope.specAreasModel.des =  false;
        $rootScope.specAreasModel.pre = false;
        updateUserSpecAreas();
      });

    }]);
})();
