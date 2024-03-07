(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('RepreCtrl', ['$scope', function ($scope) {

      $scope.myInterval = 5000;
      $scope.noWrapSlides = false;
      $scope.active = 0;
      $scope.slides = [
        {id: 0, ref: '../images/BA_color.jpg', title: 'ROMBUS BUENOS AIRES', location: 'Buenos Aires - Argentina'}
      ];

    }]);
})();
