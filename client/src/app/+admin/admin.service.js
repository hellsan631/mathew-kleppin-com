(function() {
  'use strict';

  angular
    .module('app.admin')
    .factory('Admin', AdminService);

  /* @ngInject */
  function AdminService($q, readingTime, Upload, PromiseLogger) {
    var service = {
      sanitizeAuthor: sanitizeAuthor,
      verifyArticle:  verifyArticle,
      getReadingTime: getReadingTime,
      uploadImage:    uploadImage,
      renameImage:    renameImage,
      handlePublishErrors: handlePublishErrors
    };

    return service;

    function handlePublishErrors(res){
      if (res.error) {
        return PromiseLogger.promiseError('Error publishing article', res.error);
      }

      return $q.resolve(res);
    }

    function renameImage(image) {
      var deferred = $q.defer();

      var articleName = image.name.split('.').pop();

      deferred.resolve({
        image: Upload.rename(image, articleName),
        name:  articleName
      });

      return deferred.promise;
    }

    function getReadingTime(content){
      if (content) {
        var rt = readingTime.get(content, {
          wordsPerMinute: 160,
          format: 'value_only'
        });

        rt = (rt.minutes * 60) + rt.seconds;

        return Math.ceil(rt / 60);
      }

      return 0;
    }

    function uploadImage(imageFile){
      var deferred = $q.defer();

      var uploadData = {
        url: 'api/Images/articles/upload',
        data: {
          file: imageFile
        }
      };

      Upload.upload(uploadData)
        .then(function (res) {
          deferred.resolve(res);
        }, function (res) {
          deferred.reject(res);
        }, function (evt) {
          deferred.notify(evt);
        });

      return deferred.promise;
    }

    function sanitizeAuthor(author) {
      return {
        memberGroupId: author.memberGroupId,
        memberId: author.memberId,
        membersDisplayName: author.membersDisplayName,
      };
    }

    function verifyArticle(article, image) {
      var deferred = $q.defer();

      if (article.title.length < 5) {
        deferred.reject('The title is too short');
      }

      if (article.title.content < 144) {
        deferred.reject('Not enough content');
      }

      if (article.title.category < 3) {
        deferred.reject('Category too short');
      }

      if (!image && !article.imageUrl) {
        deferred.reject('Articles require an image');
      }

      deferred.resolve(null);

      return deferred.promise;
    }
  }
})();
