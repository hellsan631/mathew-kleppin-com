(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('CacheService', CacheService);

  /* @ngInject */
  function CacheService($rootScope, $q, $localForage) {
    return {
      EVENT_PREFIX: 'cache-',
      cache: cache,
      getCurrent: getCurrent,
      subscribe: subscribe
    };

    function cache(name, items, event) {
      var deferred = $q.defer();

      //If there is no items, then we want to exit out of this
      if (!name) throw new Error('Unable to discern the name to cache');

      if (!event) event = name;

      $localForage
        .setItem(name, items)
        .then(function() {

          //broadcast that we recently updated the cache of our current user
          $rootScope.$broadcast(service.EVENT_PREFIX + event);

          deferred.resolve(items);
        })
        .catch(deferred.reject);

      return deferred.promise;
    }

    function getCurrent(name, scope, attr) {
      if (!name) throw new Error('Error Defining Get Current');

      var deferred = $q.defer();

        $localForage
          .getItem(name)
          .then(function(item) {

            // If we send in a scope, we can bind the attribute to it here, avoiding
            // extra coding to always bind the same attribute to the scope.
            if (scope && attr) {
              var mapped = scope;

              /**
               * If we want to traverse an object in the scope from this, we do
               * this here, by spliting the string and changing our refernce to 1
               * deeper. If there is no '.', it will still map us to the correct
               * place.
               */
              var fullAttrs = attr.split('.');
              var last = fullAttrs[fullAttrs.length - 1];

              for (var i = 0; i < fullAttrs.length - 1; i++) {
                mapped = mapped[fullAttrs[i]];
              }

              mapped[last] = item;
            }

            return $q.resolve(item);
          })
          .then(deferred.resolve)
          .catch(deferred.reject);

      return deferred.promise;
    }

    function subscribe(name, scope, attr, event) {
      if (!name || !scope) throw new Error('Name and Scope not specified for subscribe');

      // If there is no event, we just name the event after the name (jumps => cache-jumps)
      if (!event) event = name;

      // If there is a scope & no attribute name we can guess that the name is the attribute
      if (!attr) attr = name;

      getCurrent(name, scope, attr);

      var cleanupSubscribeBinding = $rootScope
        .$on(service.EVENT_PREFIX + event, function() {
          getCurrent(name, scope, attr);
        });

      /**
       * Binds to the scope to clean up the event binding when no longer in use
       * to avoid memory leaks
       */
      if (scope.$on) {
        scope.$on('$destroy', function() {
          cleanupSubscribeBinding();
        });
      }

    }
  }
})();
