(function() {
  'use strict';

  angular
    .module('app.core')
    .run(PermissionsConfig);

  /* @ngInject */
  function PermissionsConfig(PermPermissionStore) {
    PermPermissionStore
      .definePermission(
        'isLoggedIn', 
        () => { return false; }
      );
  }

})();
