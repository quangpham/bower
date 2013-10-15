angular.module('qpFastClick').app.directive('qpFastClick', [
  '$parse',
  'Modernizr',
  function ($parse, Modernizr) {
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var canceled, clickFunction, fn, startX, startY;
        fn = $parse(attrs.qpFastClick);
        startX = void 0;
        startY = void 0;
        canceled = void 0;
        clickFunction = function (event) {
          if (!canceled) {
            return scope.$apply(function () {
              return fn(scope, { $event: event });
            });
          }
        };
        if (Modernizr.touch) {
          element.on('touchstart', function (event) {
            var touches;
            event.stopPropagation();
            touches = event.originalEvent.touches;
            startX = touches[0].clientX;
            startY = touches[0].clientY;
            element.trigger('mousedown');
            return canceled = false;
          });
          element.on('touchend', function (event) {
            event.stopPropagation();
            element.trigger('mouseup');
            return clickFunction();
          });
          element.on('touchmove', function (event) {
            var touches;
            touches = event.originalEvent.touches;
            if (Math.abs(touches[0].clientX - startX) > 10 || Math.abs(touches[0].clientY - startY) > 10) {
              return canceled = true;
            }
          });
        }
        if (!Modernizr.touch) {
          return element.on('click', function (event) {
            return clickFunction(event);
          });
        }
      }
    };
  }
]);