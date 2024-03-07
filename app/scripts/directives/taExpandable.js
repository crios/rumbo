'use strict';

angular.module('rombusYeoApp')
  .directive('taExpandable', ['$sniffer', function($sniffer) { //taExpandable

    function getLineHeight(node){
      var computedStyle = window.getComputedStyle(node);
      var lineHeightStyle = computedStyle.lineHeight;
      if(lineHeightStyle === 'normal') {
        return +computedStyle.fontSize.slice(0, -2);
      }
      else {
        return +lineHeightStyle.slice(0, -2);
      }
    }

    return  {
      restrict: 'A',
      require: '?ngModel',
      scope: {
        taMinHeight: '='
      },
      link: function (scope, element, attr, ctrl) {
        var node = element[0];
        var lineHeight = getLineHeight(node);
        var specMinHeight = scope.taMinHeight !== undefined && scope.taMinHeight > 50 ? scope.taMinHeight : getLineHeight(node);

        function adjust(){
          if(isNaN(lineHeight)) { lineHeight = getLineHeight(node); }
          if(!(node.offsetHeight || node.offsetWidth)) { return; }
          if(node.scrollHeight <= node.clientHeight) {
            node.style.height = '0px';
          }
          var h = node.scrollHeight + // actual height defined by content
            node.offsetHeight - // border size compensation
            node.clientHeight; //       -- || --
          node.style.height = Math.max(h, lineHeight) +
            ($sniffer.msie && lineHeight ? lineHeight : 0) + // ie extra row
            'px';
          node.style.minHeight = specMinHeight + 'px';
        }

        // user input, copy, paste, cut occurrences
        element.on('input', adjust);
        element.on('change', adjust);

        if(ctrl){
          // view value changed from ngModelController - textarea content changed via javascript
          scope.$watch(function(){
            return ctrl.$viewValue;
          }, adjust);
        }

        // element became visible
        scope.$watch(function(){
          // element is visible if at least one of those values is not 0
          return node.offsetHeight || node.offsetWidth;
        }, function(newVal, oldVal){
          if(newVal && !oldVal) { adjust(); }
        });

        // initial adjust
        adjust();

        // forced adjustment
        scope.$on('taExpandable-adjust', adjust);
      }
    };
  }]);

angular.element(document.head).append(
  '<style>[taExpandable]{overflow: hidden; resize: none; box-sizing: border-box;}</style>'
);