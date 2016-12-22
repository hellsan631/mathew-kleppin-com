;(function() {
  'use strict';

  angular
      .module('blocks.logger')
      .factory('logger', logger);

  /* @ngInject */
  function logger($log, Materialize) {
    var service = {
      showToasts: true,
      showErrors: false,

      error   : error,
      info    : info,
      success : success,
      warning : warning,

      // straight to console; bypass toast
      log     : $log.log
    };

    return service;
    /////////////////////

    function error(message, data) {
      if(typeof message === 'object'){
        message = message.statusText || 'An error has occured';
      }

      if (service.showToasts && service.showErrors) {
        Materialize.toast(message, 4000, 'error');
      }

      $log.error('Error: ' + message, data);
    }

    function info(message, data, time) {
      if (!time) time = 4000;

      if (service.showToasts) {
        Materialize.toast(message, time, 'info');
      }

      $log.info('Info: ' + message, data);
    }

    function success(message, data) {
      if (service.showToasts) {
        Materialize.toast(message, 4000, 'success');
      }

      $log.info('Success: ' + message, data);
    }

    function warning(message, data) {
      if (service.showToasts) {
        Materialize.toast(message, 4000, 'warning');
      }

      $log.warn('Warning: ' + message, data);
    }
  }
}());
