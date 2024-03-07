(function() {

  'use strict';

  angular.module('rombusYeoApp').controller('WizardProjectCtrl', ['WizardProjectService', 'ParameterService', 'ModalService', 'AwsS3Service', 'ProjectService', '$q', '$rootScope', '$filter', '$routeParams', '$scope', '$location', '$timeout', '$window',
    function(WizardProjectService, ParameterService, ModalService, AwsS3Service, ProjectService, $q, $rootScope, $filter, $routeParams,$scope,$location,$timeout, $window){

      var ctrl = this;
      ctrl.currentStep = WizardProjectService.currentStep;
      ctrl.specialityCategories = null;
      ctrl.projectPaymentMethods = null;
      ctrl.projectWorkerTypes = null;
      //ctrl.currentProject = WizardProjectService.currentProject;
      ctrl.selectedSpecialtyCategory = null;
      ctrl.file = null;
      ctrl.readyToCompelteStep = false;

      ctrl.selectedSpecialty = null;

      ctrl.mouseoverFilter = true;

      ctrl.summaryAfterUpdate = $routeParams.summaryAfterUpdate === 'true';

      function updateReadyToCompleteStep(val) {
        ctrl.readyToCompelteStep = val === true;
      }

      function clean_UI_sub_Categories(){
        angular.element('.cssSubCategoria').removeClass('jmpa__active');
      }

      function clean_UI_categories(){
        angular.element('.cssCategoria').removeClass('jmpa__active');
        angular.element('.cssCategoria a').removeClass('jmpa__active');
        clean_UI_sub_Categories();
      }

      function clean_UI_specialty(){
        angular.element('.jmpa__item-card-body').removeClass('jmpa__active');
        clean_UI_categories();
      }


      $q.all([
        ParameterService.getProjectPaymentMethods(),
        ParameterService.getProjectWorkerTypes(),
        ParameterService.getSpecialtyCategories(),
        ParameterService.getSpecialtySubCategories(),
        ParameterService.getSkills()
      ]).then(
        function (values) {
          ctrl.projectPaymentMethods = values[0];
          ctrl.projectWorkerTypes = values[1];
          ctrl.specialityCategories = values[2];
          ctrl.specialtySubCategories = values[3];
          ctrl.skillList = values[4];
          console.log('VALUESSSS', values);
          ctrl.loadUIUpdates();
        },
        function () {
          ctrl.specialityCategories = null;
          ctrl.projectPaymentMethods = null;
          ctrl.projectWorkerTypes = null;
        }
      );

      ctrl.editProjectId = $routeParams.projectId;
      if(ctrl.editProjectId !== null && ctrl.editProjectId !== undefined){
        ProjectService.getProject(ctrl.editProjectId).then(
          function(response){
            WizardProjectService.currentProject = response;
            ctrl.currentProject = WizardProjectService.currentProject;
            ctrl.shouldShowEditPencil = ctrl.currentProject.status === 1 || ctrl.currentProject.status === 5 || ctrl.currentProject.status === 6;
          },
          function () { ModalService.showErrorTryAgain(); }
        );
      }
      else if(ctrl.summaryAfterUpdate === true || $routeParams.isUpdating === true){
        ctrl.currentProject = WizardProjectService.currentProject;
        ctrl.shouldShowEditPencil = ctrl.currentProject.status === 1 || ctrl.currentProject.status === 5 || ctrl.currentProject.status === 6;
      }
      else {
        // Only step 1 should get here, wizard redirects should include any other search Param
        WizardProjectService.currentProject = {};
        ctrl.currentProject = WizardProjectService.currentProject;
        ctrl.shouldShowEditPencil = ctrl.currentProject.status === 1 || ctrl.currentProject.status === 5 || ctrl.currentProject.status === 6;
      }

      $scope.fileNameChanged = function (ele) {
        var files = ele.files;

        ctrl.file = files[0];
        var reader = new FileReader();
        reader.onload = function () {
          $scope.$apply(function($scope){
            $scope.image.originalImage=reader.result;
          });
        };

        $scope.$apply(function ($scope) {
          $scope.isAddingFile = ctrl.file !== undefined;
        });
      };

      ctrl.createOrUpdateProject = function(){
        console.log('ctrl.currentProject',ctrl.currentProject);
        if(ctrl.currentProject.projectId !== undefined && ctrl.currentProject.projectId !== null){
          WizardProjectService.updateProject(ctrl.currentProject).then(
            function () {
              var nextUrl = ctrl.summaryAfterUpdate === true ? '/project-wizard/summary' : '/project-wizard/step2';
              $rootScope.changeViewWithParams(nextUrl,{isUpdating: true});
            },
            function () { ModalService.showErrorTryAgain(); }
          );
        }
        else{
          WizardProjectService.createProject(ctrl.currentProject).then(
            function () { $rootScope.changeViewWithParams('/project-wizard/step2',{isUpdating: true}); },
            function(){ ModalService.showErrorTryAgain(); }
          );
        }
      };

      ctrl.filterBySpecialty = function(){
        ctrl.filteredSpecialtySubCategories = [];
        clean_UI_specialty();
        ctrl.filteredSpecialtyCategories = $filter('filter')(ctrl.specialityCategories, {type: ctrl.selectedSpecialty});

        // Clean values
        ctrl.mouseoverFilter = true;
        ctrl.selectedSpecialtyCategory = null;
        ctrl.selectedSpecialtySubCategory = null;

        if($window.outerWidth < 767) {
          if(ctrl.lastSpecialty === ctrl.selectedSpecialty){
            ctrl.currentProject.specialtyId = null;
            ctrl.selectedSpecialty = null;
            updateReadyToCompleteStep(false);
            angular.element('.jmpa__item-card').removeClass('hidden-css');
            clean_UI_specialty();
          }
          else{
            angular.element('.jmpa__item-card').addClass('hidden-css');
            angular.element('#'+ctrl.selectedSpecialty + 'SpecialtyCol').removeClass('hidden-css');
          }
        }

        ctrl.lastSpecialty = ctrl.selectedSpecialty;

      };

      ctrl.filterBySpecialtyCategory = function(fsf){

        if(ctrl.mouseoverFilter === true){

          clean_UI_categories();
          angular.element('#fsf'+fsf.id).addClass('jmpa__active');
          angular.element('#cfsf'+fsf.id).addClass('jmpa__active');
          ctrl.selectedSpecialtyCategory = fsf;
          ctrl.filteredSpecialtySubCategories = ctrl.specialtySubCategories.get(fsf.id.toString());
        }
      };

      ctrl.selectSpecialtySubCategory = function(subCat){
        ctrl.mouseoverFilter = false;
        clean_UI_sub_Categories();
        angular.element('#subcat'+subCat.id).addClass('jmpa__active');
        angular.element('#csubcat'+subCat.id).addClass('jmpa__active');
        ctrl.selectedSpecialtySubCategory = subCat;
        ctrl.currentProject.specialtySubCategoryId = subCat.id;
      };

      ctrl.saveStep2 = function(){
        ParameterService.getSpecAreaFromName(ctrl.selectedSpecialty).then(
          function (response) {
            ctrl.currentProject.specialtyId = response.id;
            if(ctrl.selectedSpecialtyCategory !== null && ctrl.selectedSpecialtyCategory !== undefined){
              ctrl.currentProject.specialtyCategoryId = ctrl.selectedSpecialtyCategory.id;
              ctrl.currentProject.specialtyCategoryDescription = ctrl.selectedSpecialtyCategory.description;
            }
            if(ctrl.selectedSpecialtySubCategory !== null && ctrl.selectedSpecialtySubCategory !== undefined){
              ctrl.currentProject.specialtySubCategoryDescription = ctrl.selectedSpecialtySubCategory.name;
            }
            WizardProjectService.updateProject(ctrl.currentProject).then(
              function () {
                var nextUrl = ctrl.summaryAfterUpdate === true ? '/project-wizard/summary' : '/project-wizard/step3';
                $rootScope.changeViewWithParams(nextUrl,{isUpdating: true});
              },
              function () { ModalService.showErrorTryAgain(); }
            );
          }
        );
      };

      ctrl.previousStep = function(){
        if(ctrl.summaryAfterUpdate === true){
          $rootScope.changeViewWithSpecElement('/project-wizard/summary','');
        }
        else{

          var currentStep = ctrl.currentStep > 1 ? ctrl.currentStep - 1 : 1;
          WizardProjectService.currentStep = currentStep;
          $rootScope.changeViewWithParams('/project-wizard/step'+currentStep,{isUpdating: true});
        }
      };

      ctrl.saveStep3 = function(){
        ctrl.showSpinner = true;
        if(ctrl.file !== null && ctrl.file !== undefined){
          AwsS3Service.uploadProjectAsset(ctrl.file, ctrl.currentProject.projectId, ctrl.currentProject.comments).then(
            function(){
              var nextUrl = ctrl.summaryAfterUpdate === true ? '/project-wizard/summary' : '/project-wizard/step4';
              $rootScope.changeViewWithParams(nextUrl,{isUpdating: true});
            },
            function () { ctrl.showSpinner = false; ModalService.showErrorTryAgain(); }
          );
        }
        else{
          WizardProjectService.updateProject(ctrl.currentProject).then(
            function () {
              var nextUrl = ctrl.summaryAfterUpdate === true ? '/project-wizard/summary' : '/project-wizard/step4';
              $rootScope.changeViewWithParams(nextUrl,{isUpdating: true});
            },
            function () {ctrl.showSpinner = false; ModalService.showErrorTryAgain(); }
          );
        }
      };

      ctrl.deleteAsset = function(){
        WizardProjectService.deleteProjectAsset(ctrl.currentProject).then(
          function () { ctrl.currentProject.attachment = null; },
          function () { ModalService.showErrorTryAgain(); }
        );
      };

      ctrl.selectWorkerType = function(workerType) {
        updateReadyToCompleteStep(workerType === 3 || workerType === 4);
        ctrl.currentProject.paymentMethodId = null;
        ctrl.currentProject.professionalExpertise = null;
        ctrl.currentProject.recurrentType = null;
        ctrl.currentProject.suggestedPrice = null;
        ctrl.currentProject.userBudget = null;
        ctrl.currentProject.contactName = null;
        ctrl.currentProject.contactLastName = null;
        ctrl.currentProject.contactEmail = null;
        ctrl.currentProject.contactPhone = null;
        ctrl.currentProject.city = null;
        ctrl.currentProject.country = null;

        ctrl.updateSuggestedPrice();
      };

      ctrl.selectWorkerTypeForMobile = function(workerType){

        if($window.outerWidth < 767) {
          if(ctrl.lastWorkerType === workerType){
            ctrl.currentProject.workerTypeId = null;
            updateReadyToCompleteStep(false);
            angular.element('.item-resolver').removeClass('hidden-css');
          }
          else{
            angular.element('.item-resolver').addClass('hidden-css');
            angular.element('#workerType' + workerType).removeClass('hidden-css');
          }
        }
        ctrl.lastWorkerType = workerType;
      };

      ctrl.selectPaymentMethod = function(paymentMethodId){

        // Blank values from last change
        ctrl.currentProject.suggestedPrice = null;
        ctrl.currentProject.userBudget = null;
        ctrl.currentProject.hoursPerDay = null;
        ctrl.currentProject.daysPerWeek = null;
        updateReadyToCompleteStep(paymentMethodId === 1 || paymentMethodId === 3);

        ctrl.updateSuggestedPrice();
      };

      ctrl.selectRecurrentType = function() {
        updateReadyToCompleteStep(true);
      };

      ctrl.saveStep4 = function(){
        // TODO work on the logic to blank values when one top value is changed
        WizardProjectService.updateProject(ctrl.currentProject).then(
          function(){ $rootScope.changeViewWithParams('/project-wizard/summary',{isUpdating: true}); },
          function () { ModalService.showErrorTryAgain(); }
        );
      };

      ctrl.addProjectSkill = function (skill) {

        if(ctrl.currentProject.projectSkills === undefined || ctrl.currentProject.projectSkills === null){
          ctrl.currentProject.projectSkills = [];
        }
        if(ctrl.currentProject.projectSkills.length < 5){
          if(angular.isDefined(skill)){
            $scope.$broadcast('angucomplete-alt:clearInput', 'ex1');
            var tempSkill = skill.originalObject;
            tempSkill.skillid = skill.originalObject.id;
            ctrl.currentProject.projectSkills.push(tempSkill);
          }
          else{
            ModalService.showSimpleNotification('Por favor introduzca una habilidad válida');
          }
        }
        else{
          ModalService.showSimpleNotification('Ha alcanzado el limite de habilidades para un projecto');
        }
      };

      ctrl.deleteProjectSkill = function (skill) {
        for(var i = ctrl.currentProject.projectSkills.length - 1; i >= 0; i--){
          if(ctrl.currentProject.projectSkills[i].description === skill.description){
            ctrl.currentProject.projectSkills.splice(i,1);
          }
        }
      };

      ctrl.saveSummaryAsDraft = function(){
        ModalService.defaultConfirmation('modals.confirmProjectBackToDraft').then(
          function(){
            ctrl.currentProject.status = 1;
            WizardProjectService.updateProject(ctrl.currentProject).then(
              function(){ WizardProjectService.currentProject = null; $rootScope.changeViewWithSpecElement('/company-dashboard',''); },
              function () { ModalService.showErrorTryAgain(); }
            );
          }
        );

      };

      ctrl.closeProject = function(){
        ModalService.defaultConfirmation('modals.confirmProjectCancel').then(
          function () {
            ProjectService.cancelProject(ctrl.currentProject).then(
              function () { $rootScope.changeViewWithSpecElement('/company-dashboard',''); },
              function () { ModalService.showErrorTryAgain(); }
            );
          }
        );
      };

      ctrl.sendProject = function(){
        WizardProjectService.publishProject(ctrl.currentProject).then(
          function() { ModalService.showSimpleNotification('Tu proyecto ha sido publicado!'); $rootScope.changeViewWithSpecElement('/company-dashboard','');},
          function(error) {
            console.log('RTA de error de validacion del backend', error);
            ModalService.showMultipleErrorMessages(error.errorMessages);
          }
        );
        /*ModalService.showSimpleNotification('Proximamente se valida el proyecto y pasa a ABIERTO').then(
          function() { $rootScope.changeViewWithSpecElement('/company-dashboard',''); },
          function() { $rootScope.changeViewWithSpecElement('/company-dashboard',''); }
        );*/
      };

      ctrl.editPreviousStep = function(step){
        $rootScope.changeViewWithParams('/project-wizard/step'+step,{summaryAfterUpdate: 'true'});
      };

      ctrl.updateSuggestedPrice = function(){
        var specialtySubCategory = null;
        // ctrl.currentProject.suggestedPrice = WizardProjectService.calculateSuggestedPrice(100, 1000, ctrl.currentProject.workerTypeId, ctrl.currentProject.professionalExpertise);
        ParameterService.getSpecialtySubCategoryFromId(ctrl.currentProject.specialtyCategoryId, ctrl.currentProject.specialtySubCategoryId).then(
          function (response) {
            console.log('SUBCATTTTT', response);
            specialtySubCategory = response;
            console.log('updateSuggestedPrice for subcategory =', specialtySubCategory);
            ctrl.currentProject.suggestedPrice = WizardProjectService.calculateSuggestedPrice(response.minPrice, response.maxPrice, ctrl.currentProject.workerTypeId, ctrl.currentProject.professionalExpertise);
            console.log('TOMASSSSS =', ctrl.currentProject.suggestedPrice);
          }
        );
      };


      // UI
      ctrl.loadUIUpdates = function () {

        // if editing from summary apply the changes in the UI to display the current values

        if(ctrl.summaryAfterUpdate === true){
          console.log('Entramos', ctrl.currentProject);
          if($location.path().indexOf('step2') > -1){
            $timeout(function() {
              switch (ctrl.currentProject.specialtyId) {
                case 2:
                  ctrl.selectedSpecialty='mkt';
                  break;
                case 3:
                  ctrl.selectedSpecialty='des';
                  break;
                case 4:
                  ctrl.selectedSpecialty='eng';
                  break;
                case 5:
                  ctrl.selectedSpecialty='pub';
                  break;
              }
              ctrl.filterBySpecialty();
              if(ctrl.currentProject.specialtyCategoryId !== null && ctrl.currentProject.specialtyCategoryId !== undefined){

                ctrl.selectedSpecialtyCategory = $filter('filter')(ctrl.specialityCategories, {id: ctrl.currentProject.specialtyCategoryId})[0];
                //console.log('ctrl.selectedSpecialtyCategory',ctrl.selectedSpecialtyCategory);
                ctrl.filterBySpecialtyCategory(ctrl.selectedSpecialtyCategory);
                if(ctrl.currentProject.specialtySubCategoryId !== null && ctrl.currentProject.specialtySubCategoryId !== undefined){

                  ParameterService.getSpecialtySubCategoryFromId(ctrl.currentProject.specialtyCategoryId, ctrl.currentProject.specialtySubCategoryId).then(
                    function (subCat) {
                      ctrl.selectSpecialtySubCategory(subCat);
                    }
                  );
                }
              }
            }, 0);
          }
          else if($location.url().indexOf('step4') > -1){
            if(ctrl.currentProject.workerTypeId !== undefined && ctrl.currentProject.workerTypeId !== null){
              switch (ctrl.currentProject.workerTypeId) {
                case 1:
                  $timeout(function() {
                    angular.element('#workerType1').triggerHandler('click');
                    if(ctrl.currentProject.professionalExpertise > 0 && ctrl.currentProject.professionalExpertise < 4){
                      angular.element('#profExpertirse'+ctrl.currentProject.professionalExpertise).triggerHandler('click');
                    }
                    if(ctrl.currentProject.paymentMethodId > 0 && ctrl.currentProject.paymentMethodId < 4){
                      angular.element('#payMethod'+ctrl.currentProject.paymentMethodId).triggerHandler('click');
                    }
                    if(ctrl.currentProject.recurrentType > 1 && ctrl.currentProject.recurrentType < 5){
                      angular.element('#recurrentMethod'+ctrl.currentProject.recurrentType).triggerHandler('click');
                    }
                  }, 0);
                  break;
                case 2:
                  $timeout(function() {
                    angular.element('#workerType2').triggerHandler('click');
                    if(ctrl.currentProject.paymentMethodId > 0 && ctrl.currentProject.paymentMethodId < 4){
                      angular.element('#payMethod'+ctrl.currentProject.paymentMethodId).triggerHandler('click');
                    }
                    if(ctrl.currentProject.recurrentType > 1 && ctrl.currentProject.recurrentType < 5){
                      angular.element('#recurrentMethod'+ctrl.currentProject.recurrentType).triggerHandler('click');
                    }
                  }, 0);
                  break;
                case 3:
                  $timeout(function() { angular.element('#workerType3').triggerHandler('click'); }, 0);
                  break;
                case 4:
                  $timeout(function() { angular.element('#workerType4').triggerHandler('click'); }, 0);
                  break;
              }
            }
          }

          updateReadyToCompleteStep(true);
        }
      };

    }]);
})();
