(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:CompanySideBarCtrl
   * @description
   * # SideBarCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('CompanySideBarCtrl', [ '$scope', '$location', '$rootScope', '$routeParams', '$filter', 'ModalService', 'ProfileService', 'ParameterService', 'UserService', 'AwsS3Service', 'CountryPickerService', 'SpecAreaService', 'CompanyProfileService', 'ProjectService',
      function ($scope, $location, $rootScope, $routeParams, $filter, ModalService, ProfileService, ParameterService, UserService, AwsS3Service, CountryPickerService, SpecAreaService, CompanyProfileService, ProjectService) {

        var ctrl = this;
        // 0 = View and 1 = Edit
        ctrl.modeMain = 0;
        ctrl.membership = null;
        ctrl.userFunction = null;


        // company profile
        ctrl.companyFavouriteResources = [];
        ctrl.projectManager = null;
        ctrl.representative = null;

        ctrl.showViewProfileLink = $location.url().indexOf('/projects') !== -1;


        // end company profile

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
          console.log('basic company', basicInfo);
          ctrl.companyId = basicInfo.userId;
          ctrl.firstName = basicInfo.name;
          ctrl.lastName = basicInfo.surname;
          ctrl.fullName = ctrl.firstName + " " + ctrl.lastName;
          ctrl.jobTitle = basicInfo.specialityDescr;
          ctrl.city = basicInfo.city;
          ctrl.country = CountryPickerService.getCountryNameFromCode(basicInfo.country);
          ctrl.memberSince = basicInfo.memberSince;
          ctrl.phone = basicInfo.cellphone;
          ctrl.address = basicInfo.address;
          ctrl.companyJobTitle = basicInfo.companyJobTitle;
          console.log('basic company country', ctrl);

        }

        function updateAvgCompleted() {
          ProfileService.getAvgCompleted().then(
            function (response) {ctrl.percentProfCompleted = response.avgcompleted; },
            function () { ctrl.percentProfCompleted = 0; }
          );
        }

        // This needs to be the first evaluation to set the flag for service calls
        if($location.url() === '/profile-company' || $location.url() === '/company-dashboard'){
          ctrl.isSelfUser = true;
          UserService.isSelfUser = true;
          UserService.otherUserId = null;
          ctrl.hideDetails = false;
        }
        else if($location.path().indexOf('/project') === 0) {
          var companyId = $routeParams.companyId;
          UserService.isSelfUser = UserService.userId.toString() === companyId;
          ctrl.isSelfUser = UserService.isSelfUser;
          if(ctrl.isSelfUser === true){
            ctrl.showViewProfileLink = false;
          }
          if(ctrl.isSelfUser === false) { UserService.otherUserId = companyId; ctrl.hideDetails = true; }
        }
        else{
          UserService.otherUserId = $routeParams.id;
          UserService.isSelfUser = false;
          ctrl.isSelfUser = UserService.isSelfUser;
        }

        // Init operations needed
        updateSpecAreas();
        updateProfilePicture();
        updateAvgCompleted();

        ParameterService.initProfileParams();

        CompanyProfileService.getBasicInfo().then(
          function(response) { processBasicInfo(response); },
          function() { ModalService.showErrorTryAgain(); }
        );

        ProjectService.getProjectStats(ctrl.isSelfUser ? UserService.userId : UserService.otherUserId).then(
          function(response){
            console.log('RARARARA', response);
            ctrl.publishProjectAmount = response.publishedAmount;
            ctrl.hiredServicesAmount = response.hiredAmount;
          },
          function () { ctrl.publishProjectAmount = 0; ctrl.hiredServicesAmount = 0; }
        );

        ctrl.toggleMain = function () {
          if(ctrl.modeMain === 0){
            ctrl.tempFirstName = ctrl.firstName;
            ctrl.tempLastName = ctrl.lastName;
            ctrl.tempCompanyJobTitle = ctrl.companyJobTitle;
            ctrl.tempCity = ctrl.city;
            ctrl.tempCountry = ctrl.country;
            ctrl.tempPhone = ctrl.phone;
            ctrl.tempAddress = ctrl.address;
            ctrl.tempCompanyJobTitle = ctrl.companyJobTitle;
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
          ProfileService.updateBasicInfo(ctrl.tempFirstName, ctrl.tempLastName, ctrl.tempCompanyJobTitle, ctrl.tempCity,
            CountryPickerService.getCountryCodeFromName(ctrl.tempCountry), ctrl.phone, ctrl.address,
            ctrl.tempCompanyJobTitle).then(
            function () {
              ctrl.firstName = ctrl.tempFirstName;
              ctrl.lastName = ctrl.tempLastName;
              ctrl.city = ctrl.tempCity;
              ctrl.country = ctrl.tempCountry;
              ctrl.companyJobTitle = ctrl.tempCompanyJobTitle;
              ctrl.modeMain = 0;
            },
            function () {
              ModalService.showErrorTryAgain();
            }
          );


        };

        ctrl.viewProfile = function () {
          $rootScope.changeViewWithSpecElement('/profile-company/company/'+ ctrl.companyId,'');
        };

        // Listeners
        $rootScope.$on('profPicUpdated', function () {
          updateProfilePicture();
        });

        $rootScope.$on('userAvgUpdated', function () {
          updateAvgCompleted();
        });

        $rootScope.$on('specAreasUpdated',function () {
          updateSpecAreas();
        });

      }]);
})();

