;(function () {
  'use strict';

  angular
   .module('app.projects')
   .factory('ProjectService', ProjectService);

  /* @ngInject */
  function ProjectService($window, $q, $http, Trianglify) {
    /**
     * Enum of CSS selectors.
     */
    var SELECTORS = {
      pattern: '.pattern',
      card: '.card',
      cardImage: '.card__image',
      cardClose: '.card__btn-close',
    };

    /**
     * Enum of CSS classes.
     */
    var CLASSES = {
      patternHidden: 'pattern--hidden',
      polygon: 'polygon',
      polygonHidden: 'polygon--hidden'
    };

    /**
     * Map of svg paths and points.
     */
    var polygonMap = {
      paths: null,
      points: null
    };

    /**
     * Container of Card instances.
     */
    var layout = {};

    return {
      all: getAllProjects,
      init: init,
      _mapPolygons: _mapPolygons,
      _bindCards: _bindCards,
      _bindCard: _bindCard,
      _playSequence: _playSequence,
      _showHideOtherCards: _showHideOtherCards,
      _setPatternBgImg: _setPatternBgImg,
      _onCardMove: _onCardMove,
      _detectPointInCircle: _detectPointInCircle
    };

    function getAllProjects() {
      return $q.resolve([]);
    }

    function init() {

      // For options see: https://github.com/qrohlf/Trianglify
      var pattern = Trianglify({
        width: $window.innerWidth,
        height: $window.innerHeight,
        cell_size: 90,
        variance: 1,
        stroke_width: 1,
        x_colors: 'Purples'
      }).svg(); // Render as SVG.

      _mapPolygons(pattern);

      _bindCards();
    }

    function _mapPolygons(pattern) {

      // Append SVG to pattern container.
      $(SELECTORS.pattern).append(pattern);

      // Convert nodelist to array,
      // Used `.childNodes` because IE doesn't support `.children` on SVG.
      polygonMap.paths = [].slice.call(pattern.childNodes);

      polygonMap.points = [];

      polygonMap.paths.forEach(function(polygon) {

        // Hide polygons by adding CSS classes to each svg path (used attrs because of IE).
        $(polygon).attr('class', CLASSES.polygon);

        var rect = polygon.getBoundingClientRect();

        var point = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };

        polygonMap.points.push(point);
      });

      // All polygons are hidden now, display the pattern container.
      $(SELECTORS.pattern).removeClass(CLASSES.patternHidden);
    }

    function _bindCards() {

      var elements = $(SELECTORS.card);

      $.each(elements, function(index, card) {
        _bindCard(card, index, this);
      });
    }

    function _bindCard(card, index, event) {
      var instance = new Card(index, card);

      layout[index] = {
        card: instance
      };

      card.setAttribute('index', index);

      var cardImage = $(card).find(SELECTORS.cardImage);
      var cardClose = $(card).find(SELECTORS.cardClose);

      $(cardImage).on('click', _playSequence.bind(event, true, index));
      $(cardClose).on('click', _playSequence.bind(event, false, index));
    }

    function _playSequence(isOpenClick, id, event) {
      var card = layout[id].card;

      // Prevent when card already open and user click on image.
      if (card.isOpen && isOpenClick) return;

      // Create timeline for the whole sequence.
      var sequence = new TimelineLite({paused: true});

      var tweenOtherCards = _showHideOtherCards(id);

      if (!card.isOpen) {
        // Open sequence.

        _setPatternBgImg(event.target);

        sequence.add(tweenOtherCards);
        sequence.add(card.openCard(_onCardMove), 0);
        card._el.classList.add('open');

      } else {
        // Close sequence.

        var closeCard = card.closeCard();
        var position = closeCard.duration() * 0.8; // 80% of close card tween.

        sequence.add(closeCard);
        sequence.add(tweenOtherCards, position);

        setTimeout(() => {
          card._el.classList.remove('open');
        }, 1500);
      }

      sequence.play();
    }

    function _showHideOtherCards(id) {

      var TL = new TimelineLite;

      var selectedCard = layout[id].card;

      for (var i in layout) {

        var card = layout[i].card;

        // When called with `openCard`.
        if (card.id !== id && !selectedCard.isOpen) {
          TL.add(card.hideCard(), 0);
        }

        // When called with `closeCard`.
        if (card.id !== id && selectedCard.isOpen) {
          TL.add(card.showCard(), 0);
        }
      }

      return TL;
    }

    function _setPatternBgImg(image) {

      var imagePath = $(image).attr('xlink:href');

      $(SELECTORS.pattern).css('background-image', 'url(' + imagePath + ')');
    }

    function _onCardMove(track) {

      var radius = track.width / 2;

      var center = {
        x: track.x,
        y: track.y
      };

      polygonMap.points.forEach(function(point, i) {

        if (_detectPointInCircle(point, radius, center)) {
          $(polygonMap.paths[i]).attr('class', CLASSES.polygon + ' ' + CLASSES.polygonHidden);
        } else {
          $(polygonMap.paths[i]).attr('class', CLASSES.polygon);
        }
      });
    }

    function _detectPointInCircle(point, radius, center) {

      var xp = point.x;
      var yp = point.y;

      var xc = center.x;
      var yc = center.y;

      var d = radius * radius;

      var isInside = Math.pow(xp - xc, 2) + Math.pow(yp - yc, 2) <= d;

      return isInside;
    }
  }
})();