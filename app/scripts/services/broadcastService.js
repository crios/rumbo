(function() {
  'use strict';

  angular.module('rombusYeoApp')
    .service('BroadcastService', [ '$rootScope', function( $rootScope) {

      var service = this;

      service.rootScopeBroadcast = function (message, data) {
        $rootScope.$broadcast(message, data);
      };


    }]);
})();
