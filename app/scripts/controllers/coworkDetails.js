(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name rombusYeoApp.controller:CwDetailsCtrl
   * @description
   * # CwDetailsCtrl
   * Controller of the rombusYeoApp
   */
  angular.module('rombusYeoApp')
    .controller('CwDetailsCtrl', ['ContactService', 'CoworkService', '$q', '$routeParams', '$location', 'ModalService', '$scope',
      function (ContactService, CoworkService, $q, $routeParams, $location, ModalService, $scope) {

      var ctrl = this;

        function loadInfo (info) {
          ctrl.id = info.id;
          ctrl.name = info.name;
          ctrl.description = info.descr;
          ctrl.address = [info.address + ', ' + info.city + ' - ' + info.country].filter(function (val) {return val;}).join(', ');
          ctrl.zipCode = info.zipCode;
          ctrl.email = info.email;
          ctrl.phone = info.phone;
          ctrl.benefit = info.benefit;
          ctrl.vacants = info.vacants;
          ctrl.city = info.city;
          ctrl.neighborhood = info.neighborhood;
          ctrl.country = info.country;
          ctrl.bannerLocation = [ctrl.city + ', ' + ctrl.country].filter(function (val) {return val;}).join(', ');
          ctrl.fullLocation = [ctrl.neighborhood, ctrl.city, ctrl.country].filter(function (val) {return val;}).join(', ');
          ctrl.slideUrl = info.slideUrl;
        }

        function processImages(data) {
          ctrl.images = data.images;
          ctrl.banner = data.banner;
          ctrl.defineImageSplitValue(ctrl.g());
        }

        function processPlans(plans){ ctrl.planes = plans.data.plans; }

        function processServices(services) {
          ctrl.servicios = services.data.services;
          ctrl.serviciosSplit = ctrl.g()>768?3:1;
          ctrl.servicios.sort(function (a,b) {
            return b.description.length - a.description.length;
          });
        }

        function processMap(map){ ctrl.mapLocation = map.data; }

        ctrl.g = function (){
          var a=0;
          return'number'===typeof window.innerWidth?a=window.innerWidth:document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)?a=document.documentElement.clientWidth:document.body&&(document.body.clientWidth||document.body.clientHeight)&&(a=document.body.clientWidth),a;
        };

        CoworkService.getCoworkList().then(
          function (response){ ctrl.coworks = response.data; },
          function() { ctrl.coworks = []; }
        );


        ctrl.contact = function (mensaje) {
        mensaje.id = ctrl.id;
        ContactService.sendCoworkMessage(mensaje).then(
          function () {
            ModalService.showSimpleNotification('El mensaje ha sido enviado correctamente');
            $scope.mensaje = null;
          },
          function () {
            ModalService.showSimpleNotification('Ha ocurrido un problema, el mensaje no ha sido enviado');
          }
        );
      };

        ctrl.getInfo = function (coworkId) {
          $q.all([
            CoworkService.getCowork(coworkId),
            CoworkService.getImages(coworkId),
            CoworkService.getPlans(coworkId),
            CoworkService.getServices(coworkId),
            CoworkService.getMapLocation(coworkId)
          ]).then(function (values) {
            loadInfo(values[0].data);
            processImages(values[1]);
            processPlans(values[2]);
            processServices(values[3]);
            processMap(values[4]);
          }, function () {
            ctrl.goToError();
          });
        };

        ctrl.defineImageSplitValue = function (ref) {
          var screenRef=ref>=768?4:ref>=601?3:ref>=470?2:1;
          if(screenRef < 4){
            if(screenRef !== 1 && ctrl.images.length % 2 === 0){ ctrl.imagesSplit = 2;}
            else { ctrl.imagesSplit = 1; }
          }
          else {
            if (ctrl.images.length % 3 === 0) { ctrl.imagesSplit = 3; }
            else { ctrl.imagesSplit = 4; }
          }
        };

        ctrl.goToError = function () { $location.path('error'); };

        ctrl.changeCowork = function () {
          $location.path('/cowork/'+ctrl.coworkSelected.id);
          //ctrl.getInfo(ctrl.coworkSelected.id);
        };

        ctrl.shouldShowBenefit = function () {
           return ctrl.benefit !== null && !angular.isUndefined(ctrl.benefit);
        };

        ctrl.contactModal = function () { ModalService.showContact('Contratar cowork ' + ctrl.name); };

        ctrl.getInfo($routeParams.id);

    }]);
})();
