//External Lib Constants

/* global 
  Materialize:false, 
  swal:false, 
  Stripe:false,
  MaterialAvatar:false, 
  Clipboard:false,
  Vibrant: false,
  isMobile: false,
  Waypoint: false,
  Trianglify: false,
  TweenLite: false,
  TimelineLite: false
*/

;(function() {

  'use strict';

  angular
    .module('app.core')
    .constant('Materialize', Materialize)
    .constant('Trianglify', Trianglify)
    .constant('TweenLite', TweenLite)
    .constant('TimelineLite', TimelineLite)
    .constant('swal', swal);

})();
