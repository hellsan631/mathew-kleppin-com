;(function() {
  'use strict';

  angular
    .module('app.admin')
    .config(AppConfig);

  /* @ngInject */
  function AppConfig($stateProvider) {

    var adminPermissions = {
      permissions: {
        only: ['admin'],
        redirectTo: 'login'
      }
    };

    $stateProvider
      .state({
        name: 'admin',
        title: 'Admin Panel',
        url: '/admin',
        views: {
          'main@': {
            templateUrl: 'app/+admin/dashboard.html',
            controller: 'AdminDashboardController',
            controllerAs: 'vm'
          },
          'sidebar@': {
            templateUrl: 'app/+admin/admin.sidebar.html',
            controller: 'AdminNavController',
            controllerAs: 'vm'
          }
        },
        data: adminPermissions
      })
      .state({
        name: 'admin.articlesList',
        parent: 'admin',
        title: 'Admin Panel - Projects List',
        url: '/project/list',
        views: {
          'main@': {
            templateUrl: 'app/admin/list.html',
            controller: 'AdminListController',
            controllerAs: 'vm'
          }
        }
      })
      .state({
        name: 'admin.projectsCreate',
        parent: 'admin',
        title: 'Admin Panel - Projects Create',
        url: '/projects/create',
        views: {
          'main@': {
            templateUrl: 'app/+admin/create.html',
            controller: 'AdminCreateController',
            controllerAs: 'vm'
          }
        }
      })
      .state({
        name: 'admin.articlesEdit',
        parent: 'admin',
        title: 'Admin Panel - Edit Project',
        url: '/projects/{pid}',
        views: {
          'main@': {
            templateUrl: 'app/+admin/edit.html',
            controller: 'AdminEditController',
            controllerAs: 'vm'
          }
        }
      });
  }

})();
