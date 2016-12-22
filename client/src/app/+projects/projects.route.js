;(function() {
  'use strict';

  angular
    .module('app.projects')
    .config(RouteConfig);

  /* @ngInject */
  function RouteConfig($stateProvider) {

    $stateProvider
      .state({
        name: 'projects',
        url: '/projects',
        views: {
          'main@': {
            templateUrl: 'app/+projects/projects.html',
            controller: 'ProjectsController',
            controllerAs: 'vm'
          }
        },
        resolve: {
          projects: projectResolver,
        }
      });
     
  }

  /* @ngInject */
  function projectResolver(ProjectService) {
    return ProjectService.all();
  }
})();
