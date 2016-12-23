;(function() {
  'use strict';

  angular
    .module('app', [
      /* Shared Modules */
      'app.core',
      'app.widgets',
      /* Content Modules */
      'app.projects',
      'app.admin',
      'app.login'
    ]);

})();
