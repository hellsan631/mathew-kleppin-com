(function () {
  'use strict';

  angular
    .module('app.login')
    .directive('loginForm', loginForm);

  /* @ngInject */
  function loginForm() {

    var directive = {
      restrict: 'E',
      template: `
        <form name="login" ng-submit="sm.submitLogin(sm.login)">
          <material-input
            name="email"
            label="Email"
            type="email"
            required="true"
            validate="true"
            ng-model="sm.login.email">
          </material-input>

          <div class="show-con">
            <material-input
              name="password"
              label="Password"
              type="{{sm.pwtype}}"
              required="true"
              ng-model="sm.login.password">
            </material-input>
          </div>
          
          
          <action-button
            style="btn-full primary-action"
            default-message="LOG IN"
            loading-state="sm.loading">
          </action-button>
        </form>
      `,
      scope: {},
      bindToController: {
        onLoginFailure: '&',
        onLoginSuccess: '&'
      },
      controller: Controller,
      controllerAs: 'sm',
      link: (scope) => {
        scope.sm.pwtype = 'password';
      }
    };

    return directive;
  }

  /* @ngInject */
  function Controller($timeout, $stateParams, User) {
    var sm = this;

    sm.submitLogin = submitLogin;
    sm.loading = false;

    sm.pwtype = 'password';

    sm.switchType = () => {
      if (sm.pwtype === 'password')
        sm.pwtype = 'text';
      else 
        sm.pwtype = 'password';
    };

    if ($stateParams.email) {
      sm.login = {
        email: $stateParams.email.replace(/\s/g, '+')
      };
    }

    function submitLogin(login) {
      sm.loading = 'loading';

      var user = null;

      User
        .login(login)
        .then(function (res) {
          user = res || {};

          return loadingState('success', 600);
        })
        .then(function() {
          sm.onLoginSuccess({user: user});
        })
        .catch(function(error) {

          loadingState('error')
            .then(defaultLoadingState);

          sm.onLoginFailure({e: error});
        });
    }

    function defaultLoadingState() {
      return loadingState(false, 1200);
    }

    function loadingState(state, time) {
      if(!time) time = 300;

      return $timeout(function(){
        sm.loading = state;
      }, time);
    }

  }
})();
