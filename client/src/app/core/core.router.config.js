
;(function() {
  'use strict';

  angular
    .module('app.core')
    .run(RouterConfig);

  /* @ngInject */
  function RouterConfig($window, $state, $rootScope, $timeout) {
    
    let overlay = $('.lean-overlay');
    let body = $('body');
    
    let stateloaded = false;
    let pageAnimation = false;
    let animating = false;

    let timestamp;

    $rootScope.stateDeniedHistory = [];

    $state.landing = function() {
      $window.location.href = '/projects';
    };

    $rootScope.$on('$stateChangePermissionDenied', function(event, toState, toParams) {

      var history = $rootScope.stateDeniedHistory;

      // We want to get the redirecting state if any (and if any inherited from the parent)
      var redirectTo = toState.data.permissions ? toState.data.permissions.redirectTo : false;

      if (!redirectTo && toState.name.indexOf('.') > -1) {
        var parent = $state.get(toState.name.split('.')[0]);

        redirectTo = parent.data.permissions ? parent.data.permissions.redirectTo : false;
      }

      // Check to see if we have failed to redirect here already
      if (history.length === 0 || history[history.length - 1] !== toState.name) {

        // Save history for old state to redirect after we auth again
        $rootScope.redirectState = {
          state: toState,
          params: toParams,
          redirect: redirectTo
        };

        $rootScope.stateDeniedHistory.push(toState.name);
      }
    });

    $rootScope.$on('$stateChangePermissionAccepted', function(event, toState, toParams) {
      if ($rootScope.redirectState) {

        // Copy History object so we can reference it after we delete it
        var history = JSON.parse(JSON.stringify($rootScope.redirectState));

        // Make sure that we aren't redirecting to our current state
        if (!history.redirect || toState.name !== history.redirect) {
          event.preventDefault();
          delete $rootScope.redirectState;

          $state.go(history.state.name, history.params);
        }

      // Remove the successful state transition from the state history
      } else if ($rootScope.stateDeniedHistory.indexOf(toState.name) > -1) {
        $rootScope.stateDeniedHistory = $rootScope.stateDeniedHistory.filter(function(state) {
          return state !== toState.name;
        });
      }
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
      
      // Redirects for abstract states; provides backwards compatability for old links
      if (toState.redirectTo) {
       event.preventDefault();
       $state.go(toState.redirectTo, toParams);
      }

      // Fixes bugged overlay (if overlay is open on route change)
      overlay.css('display', 'none');
    });

    body.on('click', '.lean-overlay', function() {
      overlay.css('display', 'none');
    });
  }

})();
