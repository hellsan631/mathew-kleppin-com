'use strict';

/**
 * Demo.
 */
var demo = (function(window, undefined) {

  /**
   * Enum of CSS selectors.
   */
  var SELECTORS = {
    pattern: '.pattern',
    card: '.card',
    cardImage: '.card__image',
    cardClose: '.card__btn-close',
  };

  const MED_BREAKPOINT = 1000;

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

  /**
   * Initialise demo.
   */
  function init() {
    initBackground();
    let interval = null;
    let windowSize ={
      width: window.innerWidth,
      height: window.innerHeight
    };

    $('.card-wrapper').css('padding-top', calculateTopPadding(40));

    window.onresize = () => {

      if (interval) return;
      
      interval = setInterval(() => {
        if (
          windowSize.height === window.innerWidth || 
          windowSize.width === window.innerWidth
        ) {
          clearInterval(interval);

          $('.card-wrapper').css('padding-top', calculateTopPadding(40));

          setTimeout(() => {
            requestAnimationFrame(() => {
              initBackground();
              interval = null;
            });
          }, 200);

        } else {
          windowSize.height = window.innerWidth;
          windowSize.width  = window.innerWidth;
        }
      }, 100);
    };

    _bindCards();
  }

  function calculateTopPadding(percentage) {
    let height = window.innerHeight;
    let width  = window.innerWidth;
    let div    = (100/percentage);

    let padding = (height / div) - (500 / 2) - 30;

    if (width > MED_BREAKPOINT) {
      return `${padding}px`;
    }
    
    return '1em';
  }

  function initBackground() {

    let cellSize = 100;

    if (window.innerWidth < MED_BREAKPOINT) {
      cellSize = 60;
    }

    let pattern = Trianglify({
      width: window.innerWidth,
      height: window.innerHeight,
      cell_size: cellSize,
      variance: 1,
      stroke_width: 1,
      x_colors: ['#fff', '#eee', '#999']
    }).svg(); // Render as SVG.

    _mapPolygons(pattern);
  }

  /**
   * Store path elements, map coordinates and sizes.
   * @param {Element} pattern The SVG Element generated with Trianglify.
   * @private
   */
  function _mapPolygons(pattern) {

    // Append SVG to pattern container.
    $(SELECTORS.pattern).empty();
    $(SELECTORS.pattern).append(pattern);

    // Convert nodelist to array,
    // Used `.childNodes` because IE doesn't support `.children` on SVG.
    polygonMap.paths = [].slice.call(pattern.childNodes);

    polygonMap.points = [];

    polygonMap.paths.forEach(function(polygon) {

      // Hide polygons by adding CSS classes to each svg path (used attrs because of IE).
      $(polygon).attr('class', CLASSES.polygon);

      requestAnimationFrame(() => {
        var rect = polygon.getBoundingClientRect();

        var point = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };

        polygonMap.points.push(point);
      });
    });

    // All polygons are hidden now, display the pattern container.
    $(SELECTORS.pattern).removeClass(CLASSES.patternHidden);
  }

  /**
   * Bind Card elements.
   * @private
   */
  function _bindCards() {

    var elements = $(SELECTORS.card);

    $.each(elements, function(card, i) {

      var instance = new Card(i, card);

      layout[i] = {
        card: instance
      };

      var cardImage = $(card).find(SELECTORS.cardImage);
      var cardClose = $(card).find(SELECTORS.cardClose);

      $(cardImage).on('click', _playSequence.bind(this, true, i));
      $(cardClose).on('click', _playSequence.bind(this, false, i));
    });
  };

  /**
   * Create a sequence for the open or close animation and play.
   * @param {boolean} isOpenClick Flag to detect when it's a click to open.
   * @param {number} id The id of the clicked card.
   * @param {Event} e The event object.
   * @private
   *
   */
  function _playSequence(isOpenClick, id, e) {

    var card = layout[id].card;

    // Prevent when card already open and user click on image.
    if (card.isOpen && isOpenClick) return;

    // Create timeline for the whole sequence.
    var sequence = new TimelineLite({paused: true});

    var tweenOtherCards = _showHideOtherCards(id);

    if (!card.isOpen) {
      // Open sequence.

      _setPatternBgImg(e.target);

      addOpenClass(card);   

      sequence.add(tweenOtherCards);
      sequence.add(card.openCard(_onCardMove), 0);

      setTimeout(() => {
        $('.credits').addClass('hidden');
      }, 1500);

    } else {
      // Close sequence.

      var closeCard = card.closeCard();
      var position = closeCard.duration() * 0.8; // 80% of close card tween.

      sequence.add(closeCard);
      sequence.add(tweenOtherCards, position);

      setTimeout(() => {
        $('.open').removeClass('open');
        $('.credits').removeClass('hidden');
      }, 1500);
    }

    sequence.play();
  };

  /**
   * Show/Hide all other cards.
   * @param {number} id The id of the clcked card to be avoided.
   * @private
   */
  function _showHideOtherCards(id) {

    var TL = new TimelineLite;

    var selectedCard = layout[id].card;

    for (var i in layout) {

      var card = layout[i].card;

      if (card.id !== id) {
        addOpenClass(card, 600);

        if (!selectedCard.isOpen)
          TL.add(card.hideCard(), 0);
        else
          TL.add(card.showCard(), 0);
      }
    }

    return TL;
  }

  function addOpenClass(card, delay = 100) {
    setTimeout(() => card._el.classList.add('open'), delay);
  }

  /**
   * Add card image to pattern background.
   * @param {Element} image The clicked SVG Image Element.
   * @private
   */
  function _setPatternBgImg(image) {

    var imagePath = $(image).attr('xlink:href');

    $(SELECTORS.pattern).css('background-image', 'url(' + imagePath + ')');
  }

  /**
   * Callback to be executed on Tween update, whatever a polygon
   * falls into a circular area defined by the card width the path's
   * CSS class will change accordingly.
   * @param {Object} track The card sizes and position during the floating.
   * @private
   */
  function _onCardMove(track) {

    var radius = track.width / 2;

    if (window.innerWidth < MED_BREAKPOINT) {
      radius = track.width / 1.3;

      if (window.innerHeight < window.innerWidth) {
        radius = track.width / 1.75;
      }
    }

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

  /**
   * Detect if a point is inside a circle area.
   * @private
   */
  function _detectPointInCircle(point, radius, center) {

    var xp = point.x;
    var yp = point.y;

    var xc = center.x;
    var yc = center.y;

    var d = radius * radius;

    var isInside = Math.pow(xp - xc, 2) + Math.pow(yp - yc, 2) <= d;

    return isInside;
  }

  // Expose methods.
  return {
    init: init
  };

})(window);

// Kickstart Demo.
window.onload = demo.init;