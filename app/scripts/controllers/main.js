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
    .controller('MainCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {

      var ctrl = this;

      $scope.videoURL = 'https://youtu.be/LS5DGFaYlQw';

      $scope.breakpoints = [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 2,
            infinite: true,
            arrows: false,
            dots: false } },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: false,
            dots: false } },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: false } }
      ];

      ctrl.gotToServiceView = function (reference) {
        if ($(window).width() < 960) { reference = reference + '_m'; }
        $rootScope.changeViewWithSpecElement('services',reference);
      };
    }]);
})();

