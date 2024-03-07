(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:ProfileCtrl
   * @description
   * # ProfileCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('ProfileCtrl', [ '$rootScope', '$scope', '$location', '$routeParams', '$q', '$filter', '$timeout', 'ModalService', 'BroadcastService',
      'ProfileService', 'ParameterService', 'UserService', 'SkillService', 'CountryPickerService',
      function ($rootScope, $scope, $location, $routeParams, $q, $filter, $timeout, ModalService, BroadcastService,
                ProfileService, ParameterService, UserService, SkillService) {

      var ctrl = this;
      // 0 = View and 1 = Edit
      ctrl.modeMain = 0;
      ctrl.modeExtract = 0;
      ctrl.modePortfolio = 0;
      ctrl.modeCv = 0;
      ctrl.modeSideMember = 0;
      ctrl.modeSideFunction = 0;
      ctrl.portfolioItems = [];

      // This needs to be the first evaluation to set the flag for service calls
      if($location.url() === '/profile'){
        UserService.isSelfUser = true;
        ctrl.isSelfUser = UserService.isSelfUser;
      }
      else{
        UserService.otherUserId = $routeParams.id;
        UserService.isSelfUser = false;
        ctrl.isSelfUser = UserService.isSelfUser;
        ctrl.isStaffSearch = $routeParams.staffSearch === 'true';
      }
      ctrl.loginType = UserService.loginType;

      function updatePortfolio () {
        ProfileService.getPortfolioItems().then(
          function (response) {
            ctrl.portfolioItems = [];
            angular.forEach(response, function (item) {
              ParameterService.getPortfolioTypeNameFromId(item.workType).then(
                function (res) {
                  item.typeName = res.description;
                }
              );
              ctrl.portfolioItems.push(item);
            });
          },
          function () {
            ctrl.portfolioItems = [];
          });
      }

      function portfolioItemDeleted() {
        for(var i = ctrl.portfolioItems.length - 1; i >= 0; i--){
          if(ctrl.portfolioItems[i].userPortfolioId === ModalService.portfolioItemToDelete.userPortfolioId){
            ctrl.portfolioItems.splice(i,1);
          }
        }
      }

      function processExtract(extractInfo) {
        ctrl.extract = extractInfo.userextract;
      }

      function blankExtract(){
        ctrl.extract = undefined;
      }

      function processCv(cvInfo) {
        ctrl.cvExperiencia = cvInfo.experience;
        ctrl.cvFormacion = cvInfo.formation;
        ctrl.cvCertificacion = cvInfo.certifications;
      }

      function blankCv() {
        ctrl.cvExperiencia = undefined;
        ctrl.cvFormacion = undefined;
        ctrl.cvCertificacion = undefined;
      }

      function processMembership(membershipInfo){
        ParameterService.getUserMembershipsById(membershipInfo.membershipid).then(
          function (response1) {
            if(angular.isDefined(response1.portfolioamount)){ ctrl.maxAmountItems = response1.portfolioamount; }
            else{ ctrl.maxAmountItems = 4; }
          }
        );
      }

      function defaultMaxAmountItems() {
        ctrl.maxAmountItems = 0;
      }

      $q.all([
        ProfileService.getMembership(),
        ProfileService.getCv(),
        ProfileService.getExtract(),
        SkillService.getUserSkills(),
        ParameterService.initProfileParams(),
        updatePortfolio()
      ]).then(
        function(values){
          processMembership(values[0]);
          processCv(values[1]);
          processExtract(values[2]);
          try { ctrl.userSkills = values[3].skills; } catch (e) {ctrl.userSkills = []; }
        },
        function () {
          blankExtract();
          blankCv();
          defaultMaxAmountItems();
          ctrl.userPicture = null;
          ctrl.userSkills = [];
          ctrl.portfolioItems = [];
        });

      // Toggles for view/edit modes - Should be called only in own profile
      ctrl.toggleExtract = function () {
        if(ctrl.modeExtract === 0){
          ctrl.tempExtract = ctrl.extract;
          ctrl.modeExtract = 1;
        }
      };

      ctrl.saveExtract = function () {
        ProfileService.updateExtract(ctrl.tempExtract).then(
          function () {
            ctrl.extract = ctrl.tempExtract;
            ctrl.modeExtract = 0;
          },
          function () { ModalService.showErrorTryAgain(); }
        );

      };

      ctrl.togglePortfolio = function () {
        if(ctrl.modePortfolio === 0){
          ctrl.modePortfolio = 1;
        }
        else {
          ctrl.modePortfolio = 0;
        }
      };

      ctrl.addPortfolio = function () {
        ModalService.showPortfolio();
      };

      ctrl.toggleSkills = function () {
        ModalService.showSkills();
      };

      ctrl.toggleCv = function () {
        if(ctrl.modeCv === 0){
          ctrl.tempExperiencia = ctrl.cvExperiencia;
          ctrl.tempFormacion = ctrl.cvFormacion;
          ctrl.tempCertificacion = ctrl.cvCertificacion;
          ctrl.modeCv = 1;
        }
      };

      ctrl.saveCv = function () {
        // Call Profile Service to save changes
        var exp;
        try{ exp = ctrl.tempExperiencia.length > 0 ? ctrl.tempExperiencia : null;
        } catch (e) { exp = null; }
        var forma;
        try { forma = ctrl.tempFormacion.length > 0 ? ctrl.tempFormacion : null;
        } catch (e) { forma = null; }
        var cer;
        try{
          cer = ctrl.tempCertificacion.length > 0 ? ctrl.tempCertificacion : null;
        } catch (e) { cer = null; }
        ProfileService.updateCv(exp, forma, cer).then(
          function (  ) {
            ctrl.modeCv = 0;
            ctrl.cvExperiencia = exp;
            ctrl.cvFormacion = forma;
            ctrl.cvCertificacion = cer;
          },
          function () { ModalService.showErrorTryAgain('Se ha producido un error, por favor intente nuevamente'); }
        );

      };

      ctrl.showPortfolioItem = function (item) {
        ModalService.showPortfolioItem(item);
      };

      ctrl.deletePortfolio = function (item) {
        ModalService.confirmPortfolioDelete(item);
      };

      ctrl.tabSelected = function () {
        $timeout(function() {$rootScope.$broadcast('taExpandable-adjust'); }, 50);
      };

      ctrl.backToStaff = function(){
        $rootScope.changeViewWithParams('staff', {currentSearch: 'true'});
      };

      $rootScope.$on('portfolioUpdated', function () {
        updatePortfolio();
      });
      $rootScope.$on('portfolioItemDeleted', function () {
        portfolioItemDeleted();
        BroadcastService.rootScopeBroadcast('userAvgUpdated', {});
      });


    }]);
})();

