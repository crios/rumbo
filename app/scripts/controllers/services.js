(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:ServicesCtrl
   * @description
   * # ServicesCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('ServicesCtrl',  ['$routeParams', '$location', function ($routeParams, $location) {

        var ctrl = this;
        ctrl.selectedService = '';
        ctrl.backMenu = '';

        var preSelectedArea = $routeParams.area;
        if(preSelectedArea !== null && preSelectedArea !== undefined){
          ctrl.selectedService = preSelectedArea;
        }

        if(preSelectedArea !== undefined && preSelectedArea === '')
        {
          ctrl.backMenu = 'true';
        }

        ctrl.backToNormal = function(){
          ctrl.selectedService = '';
          $location.search('area', '');
        };

      }]);
})();
