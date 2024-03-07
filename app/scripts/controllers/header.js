(function() {
  /**
   * Created by Tomas Garcia on 10/16/2016.
   */
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:HeaderCtrl
   * @description
   * # HeaderCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('HeaderCtrl', ['$location', '$rootScope', 'UserService', 'LoginService', 'socialLoginService', 'AwsS3Service',
      function ($location, $rootScope, UserService, LoginService, socialLoginService, AwsS3Service) {

        var ctrl = this;

        function validateUserLoginStatus() {
          if(UserService.isLogged === true){
            ctrl.userLogged = true;
            AwsS3Service.getProfilePicture(true).then(
              function (response) {
                ctrl.profilePicture = response;
              },
              function () {
                ctrl.profilePicture = null;
              }
            );
          }
          else{
            ctrl.userLogged = false;
            ctrl.profilePicture = null;
          }
        }

        validateUserLoginStatus();

        ctrl.redirectDashboard = function(){
          if(UserService.profilePreference === '2'){
            $rootScope.changeViewWithSpecElement('company-dashboard','');
          }
          else{
            $rootScope.changeViewWithSpecElement('dashboard','');
          }
        };

        $rootScope.$on('userLoginStatus', function () {
           validateUserLoginStatus();
        });

        $rootScope.$on('profPicUpdated', function () {
          validateUserLoginStatus();
        });

        ctrl.logout = function () {
          socialLoginService.logout();
          LoginService.ClearCredentials();
          ctrl.userLogged = false;
          ctrl.profilePicture = null;
          $rootScope.changeViewWithSpecElement('/','');
        };

    }])
    .directive('scroll', function ($window) {

      return function() {
          angular.element($window).bind('scroll', function() {
            if(angular.element(window).scrollTop() > 50){
              angular.element('.navbar-fixed-top').addClass('top-nav-collapse');
            }
            else{
              angular.element('.navbar-fixed-top').removeClass('top-nav-collapse');
            }
          });
      };
    });
})();
