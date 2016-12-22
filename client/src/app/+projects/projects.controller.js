/* global Raven:false */

;(function() {
  'use strict';

  angular
    .module('app.projects')
    .controller('ProjectsController', Controller);

  /* @ngInject */
  function Controller(ProjectService) {
    let vm = this;

    ProjectService.init();

  }
})();
