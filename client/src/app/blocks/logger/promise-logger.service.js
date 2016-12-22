;(function() {
  'use strict';

  angular
      .module('blocks.logger')
      .factory('PromiseLogger', PromiseLogger);

  /* @ngInject */
  function PromiseLogger(swal, logger, $q, $rootScope, $window, $document) {
    var service = {
      showToasts: logger.showToasts,

      // List of promise log handers
      promiseError:   promiseError,
      successDialog:  successDialog,
      confirmDialog:  confirmDialog,
      errorDialog:    errorDialog,
      genericErrorDialog: genericErrorDialog,

      // bypass enhanced promise logger for non promise fallbacks
      error:   logger.error,
      info:    logger.info,
      success: logger.success,
      warning: logger.warning,
      log:     logger.log
    };

    return service;
    /////////////////////

    function promiseError(text, data) {
      logger.error(text, data);

      return $q(function quit(){return null;});
    }

    function successDialog(title, text) {
      var deferred = $q.defer();

      $rootScope.modalOpen = true;

      swal({
        title: title,
        text: text,
        type: 'success',
        allowEscapeKey: true,
        allowOutsideClick: true
      }, resolve);

      attachKeyDown(resolve);

      deferred.promise
        .then(function(){
          $rootScope.modalOpen = false;
        });

      return deferred.promise;

      function resolve() {
        deferred.resolve();
      }
    }

    function errorDialog(title, text) {
      var deferred = $q.defer();

      $rootScope.modalOpen = true;

      swal({
        title: title,
        text: text,
        type: 'error',
        allowEscapeKey: true,
        allowOutsideClick: true
      }, resolve);

      attachKeyDown(resolve);

      deferred.promise
        .then(function(){
          $rootScope.modalOpen = false;
        });

      return deferred.promise;

      function resolve() {
        deferred.resolve();
      }
    }

    function confirmDialog(title, text, successFn, waitFn) {
      var deferred = $q.defer();

      $rootScope.modalOpen = true;

      if (typeof waitFn === 'function') {
        waitFn();
      }

      swal({
        title: title,
        text: text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ffc823',
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No',
        closeOnConfirm: true,
        allowEscapeKey: true,
        allowOutsideClick: true
      }, function confirmSuccess(confirm) {
        if(typeof successFn === 'function') {
          successFn(confirm);
        }

        resolve(confirm);
      });

      attachKeyDown(resolve);

      deferred.promise
        .then(function(){
          $rootScope.modalOpen = false;
        });

      return deferred.promise;

      function resolve(confirm) {
        deferred.resolve(confirm || false);
      }
    }
    
    function genericErrorDialog(err, title){
      var message;

      if(typeof err === 'object') {
        if(err.data) {
          err = err.data;
        }

        message = err.message || err.msg;
      } else if (typeof err === 'string'){
        message = err;
      } else {
        throw new Error('Unable to find error (weird I know!)');
      }

      errorDialog(title || 'Uh oh', message);
    }

    function attachKeyDown(fn) {
      var check = setInterval(function() {
        if ($('.sweet-alert').hasClass('hideSweetAlert')) {
          callback();
        }
      }, 100);

      $document.onkeydown = function(evt) {
        evt = evt || $window.event;
        if (evt.keyCode === 27) {
          callback();
        }
      };

      function callback() {
        $document.onkeydown = null;
        clearInterval(check);
        fn();
      }
    }
  }
}());
