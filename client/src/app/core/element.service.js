(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('ElementService', ElementService);

  /* @ngInject */
  function ElementService($window, $q) {
    var service = {
      getBoundingClientRect: getBoundingClientRect,
      topOffScreen: topOffScreen,
      bottomOffScreen: bottomOffScreen,
      rightOffScreen: rightOffScreen,
      leftOffScreen: leftOffScreen,
      offScreen: offScreen,
      resize: resize,
      textColor: textColor,
      generateShadowGradient: generateShadowGradient
    };

    var badImages = [];

    return service;

    function generateShadowGradient(steps, maximum, color, opacity) {
      var shadow = '';

      for (var i = steps; i <= maximum; i = i*steps) {
        shadow += getBoxShadow('0px '+i+'px '+i+'px', getRGBA(color, opacity || 0.3));
        shadow += i >= maximum ? '' : ',';
      }

      return shadow;
    }

    function getBoxShadow(px, color) {
      return px + ' ' + color;
    }

    function getRGBA(color, opacity) {
      var r = 0; var g = 1; var b = 2;
      return 'rgba(' + color[r] + ',' + color[g] + ',' + color[b] + ', ' + opacity+ ')';
    }

    function textColor(hexcolor) {
      var r = parseInt(hexcolor.substr(0,2),16);
      var g = parseInt(hexcolor.substr(2,2),16);
      var b = parseInt(hexcolor.substr(4,2),16);
      var yiq = ((r*299)+(g*587)+(b*114))/1000;
      return (yiq >= 128) ? '#212121' : '#fff';
    }

    function resize(callback, scope, container) {
      if (!container) container = $window;

      angular.element(container).on('resize', callback);

      if (scope) {
        scope.$on('$destroy', function() {
          angular.element(container).off('resize', callback);
        });
      }
    }

    function offScreen(el) {
      var rect = el.getBoundingClientRect();
      return (
        (rect.left + rect.width) < 0 ||
        (rect.top + rect.height) < 0 ||
        (rect.left > $window.innerWidth || rect.top > $window.innerHeight)
      );
    }

    function topOffScreen(container, ele) {
      return getBoundingClientRect(container).top < getBoundingClientRect(ele).top;
    }

    function bottomOffScreen(container, ele) {
      return getBoundingClientRect(container).bottom < getBoundingClientRect(ele).bottom;
    }

    function rightOffScreen(container, ele) {
      return getBoundingClientRect(container).right < getBoundingClientRect(ele).right;
    }

    function leftOffScreen(container, ele) {
      return getBoundingClientRect(container).left > getBoundingClientRect(ele).left;
    }

    function getBoundingClientRect(ele) {
      return ele.getBoundingClientRect();
    }
  }
})();
