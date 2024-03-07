(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:FooterCtrl
   * @description
   * # FooterCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('FooterCtrl', ['$location', '$document', function ($location, $document) {

      this.changeView = function ( path ) {
        $location.path(path);
      };

      this.changeViewWithSpecElement = function (path, element) {
        if(($location.url() === '/' || $location.url().charAt(1) === '#') && path === ''){
          var tomas = angular.element(document.getElementById(element));
          $document.duScrollToElementAnimated(tomas);
        }
        else{
          $location.path(path).hash(element);
        }
      };

    }]);
})();
