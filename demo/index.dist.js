(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _docReady = require('doc-ready');

var _docReady2 = _interopRequireDefault(_docReady);

var _SlimFady = require('../src/SlimFady');

var _SlimFady2 = _interopRequireDefault(_SlimFady);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _docReady2.default)(function () {
  var sf = new _SlimFady2.default({
    container: '.js-demo-controls',
    delay: 80
  });
  var start = document.querySelector('.js-start');
  var stop = document.querySelector('.js-stop');
  var clear = document.querySelector('.js-clear');

  start.addEventListener('click', function () {
    return sf.startAnimation();
  });
  stop.addEventListener('click', function () {
    return sf.stopAnimation();
  });
  clear.addEventListener('click', function () {
    return sf.clearAnimation();
  });

  var sf1 = new _SlimFady2.default({
    container: '.js-demo-1'
  });

  var sf2 = new _SlimFady2.default({
    container: '.js-demo-2'
  });

  sf1.startAnimation();
  sf2.startAnimation();
});

},{"../src/SlimFady":5,"doc-ready":2}],2:[function(require,module,exports){
/*!
 * docReady v1.0.4
 * Cross browser DOMContentLoaded event emitter
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true*/
/*global define: false, require: false, module: false */

( function( window ) {

'use strict';

var document = window.document;
// collection of functions to be triggered on ready
var queue = [];

function docReady( fn ) {
  // throw out non-functions
  if ( typeof fn !== 'function' ) {
    return;
  }

  if ( docReady.isReady ) {
    // ready now, hit it
    fn();
  } else {
    // queue function when ready
    queue.push( fn );
  }
}

docReady.isReady = false;

// triggered on various doc ready events
function onReady( event ) {
  // bail if already triggered or IE8 document is not ready just yet
  var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
  if ( docReady.isReady || isIE8NotReady ) {
    return;
  }

  trigger();
}

function trigger() {
  docReady.isReady = true;
  // process queue
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var fn = queue[i];
    fn();
  }
}

function defineDocReady( eventie ) {
  // trigger ready if page is ready
  if ( document.readyState === 'complete' ) {
    trigger();
  } else {
    // listen for events
    eventie.bind( document, 'DOMContentLoaded', onReady );
    eventie.bind( document, 'readystatechange', onReady );
    eventie.bind( window, 'load', onReady );
  }

  return docReady;
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [ 'eventie/eventie' ], defineDocReady );
} else if ( typeof exports === 'object' ) {
  module.exports = defineDocReady( require('eventie') );
} else {
  // browser global
  window.docReady = defineDocReady( window.eventie );
}

})( window );

},{"eventie":4}],3:[function(require,module,exports){
/**
 * Module export
 *
 * @param {Element} el
 * @return {ClassList}
 */

module.exports = function (el) {
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for the given element
 *
 * @param {Element} el DOM Element
 */
function ClassList(el) {
  if (!el || el.nodeType !== 1) {
    throw new Error('A DOM Element reference is required');
  }

  this.el = el;
  this.classList = el.classList;
}

/**
 * Check token validity
 *
 * @param token
 * @param [method]
 */
function checkToken(token, method) {
  method = method || 'a method';

  if (typeof token != 'string') {
    throw new TypeError(
      'Failed to execute \'' + method + '\' on \'ClassList\': ' +
      'the token provided (\'' + token + '\') is not a string.'
    );
  }
  if (token === "") {
    throw new SyntaxError(
      'Failed to execute \'' + method + '\' on \'ClassList\': ' +
      'the token provided must not be empty.'
    );
  }
  if (/\s/.test(token)) {
    throw new Error(
      'Failed to execute \'' + method + '\' on \'ClassList\': ' +
      'the token provided (\'' + token + '\') contains HTML space ' +
      'characters, which are not valid in tokens.'
    );
  }
}

/**
 * Return an array of the class names on the element.
 *
 * @return {Array}
 */
ClassList.prototype.toArray = function () {
  var str = (this.el.getAttribute('class') || '').replace(/^\s+|\s+$/g, '');
  var classes = str.split(/\s+/);
  if ('' === classes[0]) { classes.shift(); }
  return classes;
};

/**
 * Add the given `token` to the class list if it's not already present.
 *
 * @param {String} token
 */
ClassList.prototype.add = function (token) {
  var classes, index, updated;
  checkToken(token, 'add');

  if (this.classList) {
    this.classList.add(token);
  }
  else {
    // fallback
    classes = this.toArray();
    index = classes.indexOf(token);
    if (index === -1) {
      classes.push(token);
      this.el.setAttribute('class', classes.join(' '));
    }
  }

  return;
};

/**
 * Check if the given `token` is in the class list.
 *
 * @param {String} token
 * @return {Boolean}
 */
ClassList.prototype.contains = function (token) {
  checkToken(token, 'contains');

  return this.classList ?
    this.classList.contains(token) :
    this.toArray().indexOf(token) > -1;
};

/**
 * Remove any class names that match the given `token`, when present.
 *
 * @param {String|RegExp} token
 */
ClassList.prototype.remove = function (token) {
  var arr, classes, i, index, len;

  if ('[object RegExp]' == Object.prototype.toString.call(token)) {
    arr = this.toArray();
    for (i = 0, len = arr.length; i < len; i++) {
      if (token.test(arr[i])) {
        this.remove(arr[i]);
      }
    }
  }
  else {
    checkToken(token, 'remove');

    if (this.classList) {
      this.classList.remove(token);
    }
    else {
      // fallback
      classes = this.toArray();
      index = classes.indexOf(token);
      if (index > -1) {
        classes.splice(index, 1);
        this.el.setAttribute('class', classes.join(' '));
      }
    }
  }

  return;
};

/**
 * Toggle the `token` in the class list. Optionally force state via `force`.
 *
 * Native `classList` is not used as some browsers that support `classList` do
 * not support `force`. Avoiding `classList` altogether keeps this function
 * simple.
 *
 * @param {String} token
 * @param {Boolean} [force]
 * @return {Boolean}
 */
ClassList.prototype.toggle = function (token, force) {
  checkToken(token, 'toggle');

  var hasToken = this.contains(token);
  var method = hasToken ? (force !== true && 'remove') : (force !== false && 'add');

  if (method) {
    this[method](token);
  }

  return (typeof force == 'boolean' ? force : !hasToken);
};

},{}],4:[function(require,module,exports){
/*!
 * eventie v1.0.6
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// ----- module definition ----- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( eventie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = eventie;
} else {
  // browser global
  window.eventie = eventie;
}

})( window );

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _domClasslist = require('dom-classlist');

var _domClasslist2 = _interopRequireDefault(_domClasslist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.default = function (options) {
  var CONTAINER_CLASS_NAME = 'sf-container';
  var BASE_CLASS_NAME = 'sf-blink';
  var ANIM_CLASS_NAME = 'sf-an-blink';
  var excludedChars = ['', ' ', '\n', '\r', '\t'];
  var intervalDelay = void 0;
  var intervalId = void 0;
  var containerEl = void 0;
  var isPaused = void 0;

  var SlimFady = function () {
    function SlimFady(options) {
      _classCallCheck(this, SlimFady);

      this.options = _extends({}, options);
      checkOptions(this.options);

      containerEl = document.querySelector(this.options.container);
      if (containerEl === null) {
        throw new Error('Could not find a DOM element by using selector: ' + options.container);
      }
      (0, _domClasslist2.default)(containerEl).remove(CONTAINER_CLASS_NAME);

      intervalDelay = this.options.delay || 20;

      wrap(containerEl);
    }

    _createClass(SlimFady, [{
      key: 'startAnimation',
      value: function startAnimation() {
        if (this.isAnimating()) {
          return;
        }

        var selector = '.' + BASE_CLASS_NAME;

        if (isPaused === true) {
          selector += ':not(.' + ANIM_CLASS_NAME + ')';
        }

        isPaused = false;

        var elements = containerEl.querySelectorAll(selector);
        animateElements.call(this, elements);
      }
    }, {
      key: 'stopAnimation',
      value: function stopAnimation() {
        if (this.isAnimating()) {
          isPaused = true;
        }

        clearInterval(intervalId);
        intervalId = undefined;
      }
    }, {
      key: 'clearAnimation',
      value: function clearAnimation() {
        this.stopAnimation();
        isPaused = false;

        var elements = toArray(containerEl.querySelectorAll('.' + ANIM_CLASS_NAME));
        elements.forEach(function (el) {
          (0, _domClasslist2.default)(el).remove(ANIM_CLASS_NAME);
        });
      }
    }, {
      key: 'isAnimating',
      value: function isAnimating() {
        return intervalId !== undefined;
      }
    }]);

    return SlimFady;
  }();

  /**
   * @param {Array.<HTMLElement>|NodeList.<HTMLElement>} elements
   * @this SlimFady
   */


  function animateElements(elements) {
    var _this = this;

    if (elements.length === 0) {
      return;
    }

    if (!Array.isArray(elements)) {
      elements = toArray(elements);
    }

    intervalId = setInterval(function () {
      var len = elements.length;

      if (len === 0) {
        _this.stopAnimation();
        isPaused = false;
        return;
      }

      var index = randomIntFromRange(0, len - 1);
      animateElement(elements[index]);
      elements.splice(index, 1);
    }, intervalDelay);
  }

  /**
   * @param {HTMLElement} el
   */
  function animateElement(el) {
    (0, _domClasslist2.default)(el).add(ANIM_CLASS_NAME);
  }

  /**
   * @returns {number}
   */
  function randomIntFromRange(min, max) {
    return ~~(Math.random() * (max - min) + min);
  }

  /**
   * @throws {Error}
   */
  function checkOptions(options) {
    if (typeof options.container !== 'string') {
      throw new Error('Please set container option as a string and valid selector, got ' + _typeof(options.container));
    }

    if (options.delay !== undefined && typeof options.delay !== 'number') {
      throw new Error('Please set delay option as a number, got ' + _typeof(options.delay));
    }
  }

  /**
   * Traverses down subtree of provided element and picks only text nodes.
   * Each character of text nodes is wrapped with <span...> element.
   * This method adds also attribute aria-label for provided element.
   * @param {HTMLElement} el
   */
  function wrap(el) {
    var textNodesToWrap = [];
    walkTheDOM(el, function (node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.length > 0) {
        textNodesToWrap.push(node);
      }
    });

    textNodesToWrap.forEach(function (node) {
      var nodeToSplit = node;
      var textLength = node.textContent.length;

      for (var i = 0; i < textLength; i++) {
        // if nodeToSplit is "Abcde" , then
        // nodeToSplit = "A"
        // siblingNode = "bcde"
        // @see https://developer.mozilla.org/en-US/docs/Web/API/Text/splitText
        var siblingNode = nodeToSplit.splitText(1);

        if (isExludedChar(nodeToSplit.textContent)) {
          nodeToSplit = siblingNode;
          continue;
        }

        var wrapper = createWrapperNode();

        wrapper.appendChild(nodeToSplit.cloneNode(false));
        nodeToSplit.parentNode.replaceChild(wrapper, nodeToSplit);

        nodeToSplit = siblingNode;
      }
    });

    el.setAttribute('aria-label', el.textContent);
  }

  /**
   * @author Douglas Crockford
   * @param {Node} node
   * @param {Function} fn
   * @see https://www.youtube.com/watch?v=Y2Y0U-2qJMs&feature=youtu.be&t=27m15s
   */
  function walkTheDOM(node, fn) {
    fn(node);
    node = node.firstChild;
    while (node) {
      walkTheDOM(node, fn);
      node = node.nextSibling;
    }
  }

  /**
   * @returns {HTMLElement}
   */
  function createWrapperNode() {
    var wrapper = document.createElement('span');
    wrapper.className = BASE_CLASS_NAME;
    wrapper.setAttribute('aria-hidden', 'true');
    return wrapper;
  }

  /**
   * @param {HTMLCollection|NodeList} list
   * @returns {Array}
   */
  function toArray(list) {
    return Array.prototype.slice.call(list);
  }

  /**
   * @returns {boolean}
   */
  function isExludedChar(c) {
    return excludedChars.indexOf(c) > -1;
  }

  return new SlimFady(options);
};

module.exports = exports['default'];

},{"dom-classlist":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RvYy1yZWFkeS9kb2MtcmVhZHkuanMiLCJub2RlX21vZHVsZXMvZG9tLWNsYXNzbGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ldmVudGllL2V2ZW50aWUuanMiLCJzcmMvU2xpbUZhZHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7OztBQUVBLHdCQUFTLFlBQU07QUFDYixNQUFNLEtBQUssdUJBQWE7QUFDdEIsZUFBVyxtQkFEVztBQUV0QixXQUFPO0FBRmUsR0FBYixDQUFYO0FBSUEsTUFBTSxRQUFRLFNBQVMsYUFBVCxDQUF1QixXQUF2QixDQUFkO0FBQ0EsTUFBTSxPQUFPLFNBQVMsYUFBVCxDQUF1QixVQUF2QixDQUFiO0FBQ0EsTUFBTSxRQUFRLFNBQVMsYUFBVCxDQUF1QixXQUF2QixDQUFkOztBQUVBLFFBQU0sZ0JBQU4sQ0FBdUIsT0FBdkIsRUFBZ0M7QUFBQSxXQUFNLEdBQUcsY0FBSCxFQUFOO0FBQUEsR0FBaEM7QUFDQSxPQUFLLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCO0FBQUEsV0FBTSxHQUFHLGFBQUgsRUFBTjtBQUFBLEdBQS9CO0FBQ0EsUUFBTSxnQkFBTixDQUF1QixPQUF2QixFQUFnQztBQUFBLFdBQU0sR0FBRyxjQUFILEVBQU47QUFBQSxHQUFoQzs7QUFFQSxNQUFNLE1BQU0sdUJBQWE7QUFDdkIsZUFBVztBQURZLEdBQWIsQ0FBWjs7QUFJQSxNQUFNLE1BQU0sdUJBQWE7QUFDdkIsZUFBVztBQURZLEdBQWIsQ0FBWjs7QUFJQSxNQUFJLGNBQUo7QUFDQSxNQUFJLGNBQUo7QUFDRCxDQXZCRDs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUg7QUFDQSxXQUFPLEtBQUssVUFBWjtBQUNBLFdBQU0sSUFBTixFQUFZO0FBQ1YsaUJBQVcsSUFBWCxFQUFpQixFQUFqQjtBQUNBLGFBQU8sS0FBSyxXQUFaO0FBQ0Q7QUFDRjs7QUFFRDs7O0FBR0EsV0FBUyxpQkFBVCxHQUE2QjtBQUMzQixRQUFNLFVBQVUsU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQWhCO0FBQ0EsWUFBUSxTQUFSLEdBQW9CLGVBQXBCO0FBQ0EsWUFBUSxZQUFSLENBQXFCLGFBQXJCLEVBQW9DLE1BQXBDO0FBQ0EsV0FBTyxPQUFQO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxXQUFTLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUI7QUFDckIsV0FBTyxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBUDtBQUNEOztBQUVEOzs7QUFHQSxXQUFTLGFBQVQsQ0FBdUIsQ0FBdkIsRUFBMEI7QUFDeEIsV0FBTyxjQUFjLE9BQWQsQ0FBc0IsQ0FBdEIsSUFBMkIsQ0FBQyxDQUFuQztBQUNEOztBQUVELFNBQU8sSUFBSSxRQUFKLENBQWEsT0FBYixDQUFQO0FBQ0QsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgZG9jUmVhZHkgZnJvbSAnZG9jLXJlYWR5JztcbmltcG9ydCBTbGltRmFkeSBmcm9tICcuLi9zcmMvU2xpbUZhZHknO1xuXG5kb2NSZWFkeSgoKSA9PiB7XG4gIGNvbnN0IHNmID0gbmV3IFNsaW1GYWR5KHtcbiAgICBjb250YWluZXI6ICcuanMtZGVtby1jb250cm9scycsXG4gICAgZGVsYXk6IDgwXG4gIH0pO1xuICBjb25zdCBzdGFydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1zdGFydCcpO1xuICBjb25zdCBzdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXN0b3AnKTtcbiAgY29uc3QgY2xlYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtY2xlYXInKTtcblxuICBzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNmLnN0YXJ0QW5pbWF0aW9uKCkpO1xuICBzdG9wLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gc2Yuc3RvcEFuaW1hdGlvbigpKTtcbiAgY2xlYXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzZi5jbGVhckFuaW1hdGlvbigpKTtcblxuICBjb25zdCBzZjEgPSBuZXcgU2xpbUZhZHkoe1xuICAgIGNvbnRhaW5lcjogJy5qcy1kZW1vLTEnXG4gIH0pO1xuXG4gIGNvbnN0IHNmMiA9IG5ldyBTbGltRmFkeSh7XG4gICAgY29udGFpbmVyOiAnLmpzLWRlbW8tMidcbiAgfSk7XG5cbiAgc2YxLnN0YXJ0QW5pbWF0aW9uKCk7XG4gIHNmMi5zdGFydEFuaW1hdGlvbigpO1xufSk7XG4iLCIvKiFcbiAqIGRvY1JlYWR5IHYxLjAuNFxuICogQ3Jvc3MgYnJvd3NlciBET01Db250ZW50TG9hZGVkIGV2ZW50IGVtaXR0ZXJcbiAqIE1JVCBsaWNlbnNlXG4gKi9cblxuLypqc2hpbnQgYnJvd3NlcjogdHJ1ZSwgc3RyaWN0OiB0cnVlLCB1bmRlZjogdHJ1ZSwgdW51c2VkOiB0cnVlKi9cbi8qZ2xvYmFsIGRlZmluZTogZmFsc2UsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdyApIHtcblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4vLyBjb2xsZWN0aW9uIG9mIGZ1bmN0aW9ucyB0byBiZSB0cmlnZ2VyZWQgb24gcmVhZHlcbnZhciBxdWV1ZSA9IFtdO1xuXG5mdW5jdGlvbiBkb2NSZWFkeSggZm4gKSB7XG4gIC8vIHRocm93IG91dCBub24tZnVuY3Rpb25zXG4gIGlmICggdHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICggZG9jUmVhZHkuaXNSZWFkeSApIHtcbiAgICAvLyByZWFkeSBub3csIGhpdCBpdFxuICAgIGZuKCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gcXVldWUgZnVuY3Rpb24gd2hlbiByZWFkeVxuICAgIHF1ZXVlLnB1c2goIGZuICk7XG4gIH1cbn1cblxuZG9jUmVhZHkuaXNSZWFkeSA9IGZhbHNlO1xuXG4vLyB0cmlnZ2VyZWQgb24gdmFyaW91cyBkb2MgcmVhZHkgZXZlbnRzXG5mdW5jdGlvbiBvblJlYWR5KCBldmVudCApIHtcbiAgLy8gYmFpbCBpZiBhbHJlYWR5IHRyaWdnZXJlZCBvciBJRTggZG9jdW1lbnQgaXMgbm90IHJlYWR5IGp1c3QgeWV0XG4gIHZhciBpc0lFOE5vdFJlYWR5ID0gZXZlbnQudHlwZSA9PT0gJ3JlYWR5c3RhdGVjaGFuZ2UnICYmIGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdjb21wbGV0ZSc7XG4gIGlmICggZG9jUmVhZHkuaXNSZWFkeSB8fCBpc0lFOE5vdFJlYWR5ICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRyaWdnZXIoKTtcbn1cblxuZnVuY3Rpb24gdHJpZ2dlcigpIHtcbiAgZG9jUmVhZHkuaXNSZWFkeSA9IHRydWU7XG4gIC8vIHByb2Nlc3MgcXVldWVcbiAgZm9yICggdmFyIGk9MCwgbGVuID0gcXVldWUubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgdmFyIGZuID0gcXVldWVbaV07XG4gICAgZm4oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWZpbmVEb2NSZWFkeSggZXZlbnRpZSApIHtcbiAgLy8gdHJpZ2dlciByZWFkeSBpZiBwYWdlIGlzIHJlYWR5XG4gIGlmICggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJyApIHtcbiAgICB0cmlnZ2VyKCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gbGlzdGVuIGZvciBldmVudHNcbiAgICBldmVudGllLmJpbmQoIGRvY3VtZW50LCAnRE9NQ29udGVudExvYWRlZCcsIG9uUmVhZHkgKTtcbiAgICBldmVudGllLmJpbmQoIGRvY3VtZW50LCAncmVhZHlzdGF0ZWNoYW5nZScsIG9uUmVhZHkgKTtcbiAgICBldmVudGllLmJpbmQoIHdpbmRvdywgJ2xvYWQnLCBvblJlYWR5ICk7XG4gIH1cblxuICByZXR1cm4gZG9jUmVhZHk7XG59XG5cbi8vIHRyYW5zcG9ydFxuaWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gIC8vIEFNRFxuICBkZWZpbmUoIFsgJ2V2ZW50aWUvZXZlbnRpZScgXSwgZGVmaW5lRG9jUmVhZHkgKTtcbn0gZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVEb2NSZWFkeSggcmVxdWlyZSgnZXZlbnRpZScpICk7XG59IGVsc2Uge1xuICAvLyBicm93c2VyIGdsb2JhbFxuICB3aW5kb3cuZG9jUmVhZHkgPSBkZWZpbmVEb2NSZWFkeSggd2luZG93LmV2ZW50aWUgKTtcbn1cblxufSkoIHdpbmRvdyApO1xuIiwiLyoqXG4gKiBNb2R1bGUgZXhwb3J0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHJldHVybiB7Q2xhc3NMaXN0fVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVsKSB7XG4gIHJldHVybiBuZXcgQ2xhc3NMaXN0KGVsKTtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBDbGFzc0xpc3QgZm9yIHRoZSBnaXZlbiBlbGVtZW50XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbCBET00gRWxlbWVudFxuICovXG5mdW5jdGlvbiBDbGFzc0xpc3QoZWwpIHtcbiAgaWYgKCFlbCB8fCBlbC5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQSBET00gRWxlbWVudCByZWZlcmVuY2UgaXMgcmVxdWlyZWQnKTtcbiAgfVxuXG4gIHRoaXMuZWwgPSBlbDtcbiAgdGhpcy5jbGFzc0xpc3QgPSBlbC5jbGFzc0xpc3Q7XG59XG5cbi8qKlxuICogQ2hlY2sgdG9rZW4gdmFsaWRpdHlcbiAqXG4gKiBAcGFyYW0gdG9rZW5cbiAqIEBwYXJhbSBbbWV0aG9kXVxuICovXG5mdW5jdGlvbiBjaGVja1Rva2VuKHRva2VuLCBtZXRob2QpIHtcbiAgbWV0aG9kID0gbWV0aG9kIHx8ICdhIG1ldGhvZCc7XG5cbiAgaWYgKHR5cGVvZiB0b2tlbiAhPSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnRmFpbGVkIHRvIGV4ZWN1dGUgXFwnJyArIG1ldGhvZCArICdcXCcgb24gXFwnQ2xhc3NMaXN0XFwnOiAnICtcbiAgICAgICd0aGUgdG9rZW4gcHJvdmlkZWQgKFxcJycgKyB0b2tlbiArICdcXCcpIGlzIG5vdCBhIHN0cmluZy4nXG4gICAgKTtcbiAgfVxuICBpZiAodG9rZW4gPT09IFwiXCIpIHtcbiAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXG4gICAgICAnRmFpbGVkIHRvIGV4ZWN1dGUgXFwnJyArIG1ldGhvZCArICdcXCcgb24gXFwnQ2xhc3NMaXN0XFwnOiAnICtcbiAgICAgICd0aGUgdG9rZW4gcHJvdmlkZWQgbXVzdCBub3QgYmUgZW1wdHkuJ1xuICAgICk7XG4gIH1cbiAgaWYgKC9cXHMvLnRlc3QodG9rZW4pKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0ZhaWxlZCB0byBleGVjdXRlIFxcJycgKyBtZXRob2QgKyAnXFwnIG9uIFxcJ0NsYXNzTGlzdFxcJzogJyArXG4gICAgICAndGhlIHRva2VuIHByb3ZpZGVkIChcXCcnICsgdG9rZW4gKyAnXFwnKSBjb250YWlucyBIVE1MIHNwYWNlICcgK1xuICAgICAgJ2NoYXJhY3RlcnMsIHdoaWNoIGFyZSBub3QgdmFsaWQgaW4gdG9rZW5zLidcbiAgICApO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJuIGFuIGFycmF5IG9mIHRoZSBjbGFzcyBuYW1lcyBvbiB0aGUgZWxlbWVudC5cbiAqXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuQ2xhc3NMaXN0LnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc3RyID0gKHRoaXMuZWwuZ2V0QXR0cmlidXRlKCdjbGFzcycpIHx8ICcnKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG4gIHZhciBjbGFzc2VzID0gc3RyLnNwbGl0KC9cXHMrLyk7XG4gIGlmICgnJyA9PT0gY2xhc3Nlc1swXSkgeyBjbGFzc2VzLnNoaWZ0KCk7IH1cbiAgcmV0dXJuIGNsYXNzZXM7XG59O1xuXG4vKipcbiAqIEFkZCB0aGUgZ2l2ZW4gYHRva2VuYCB0byB0aGUgY2xhc3MgbGlzdCBpZiBpdCdzIG5vdCBhbHJlYWR5IHByZXNlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRva2VuXG4gKi9cbkNsYXNzTGlzdC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gIHZhciBjbGFzc2VzLCBpbmRleCwgdXBkYXRlZDtcbiAgY2hlY2tUb2tlbih0b2tlbiwgJ2FkZCcpO1xuXG4gIGlmICh0aGlzLmNsYXNzTGlzdCkge1xuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCh0b2tlbik7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gZmFsbGJhY2tcbiAgICBjbGFzc2VzID0gdGhpcy50b0FycmF5KCk7XG4gICAgaW5kZXggPSBjbGFzc2VzLmluZGV4T2YodG9rZW4pO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIGNsYXNzZXMucHVzaCh0b2tlbik7XG4gICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc2VzLmpvaW4oJyAnKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZ2l2ZW4gYHRva2VuYCBpcyBpbiB0aGUgY2xhc3MgbGlzdC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdG9rZW5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbkNsYXNzTGlzdC5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgY2hlY2tUb2tlbih0b2tlbiwgJ2NvbnRhaW5zJyk7XG5cbiAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0ID9cbiAgICB0aGlzLmNsYXNzTGlzdC5jb250YWlucyh0b2tlbikgOlxuICAgIHRoaXMudG9BcnJheSgpLmluZGV4T2YodG9rZW4pID4gLTE7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbnkgY2xhc3MgbmFtZXMgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4gYHRva2VuYCwgd2hlbiBwcmVzZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gdG9rZW5cbiAqL1xuQ2xhc3NMaXN0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgdmFyIGFyciwgY2xhc3NlcywgaSwgaW5kZXgsIGxlbjtcblxuICBpZiAoJ1tvYmplY3QgUmVnRXhwXScgPT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRva2VuKSkge1xuICAgIGFyciA9IHRoaXMudG9BcnJheSgpO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHRva2VuLnRlc3QoYXJyW2ldKSkge1xuICAgICAgICB0aGlzLnJlbW92ZShhcnJbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBjaGVja1Rva2VuKHRva2VuLCAncmVtb3ZlJyk7XG5cbiAgICBpZiAodGhpcy5jbGFzc0xpc3QpIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSh0b2tlbik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gZmFsbGJhY2tcbiAgICAgIGNsYXNzZXMgPSB0aGlzLnRvQXJyYXkoKTtcbiAgICAgIGluZGV4ID0gY2xhc3Nlcy5pbmRleE9mKHRva2VuKTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIGNsYXNzZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3Nlcy5qb2luKCcgJykpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybjtcbn07XG5cbi8qKlxuICogVG9nZ2xlIHRoZSBgdG9rZW5gIGluIHRoZSBjbGFzcyBsaXN0LiBPcHRpb25hbGx5IGZvcmNlIHN0YXRlIHZpYSBgZm9yY2VgLlxuICpcbiAqIE5hdGl2ZSBgY2xhc3NMaXN0YCBpcyBub3QgdXNlZCBhcyBzb21lIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBgY2xhc3NMaXN0YCBkb1xuICogbm90IHN1cHBvcnQgYGZvcmNlYC4gQXZvaWRpbmcgYGNsYXNzTGlzdGAgYWx0b2dldGhlciBrZWVwcyB0aGlzIGZ1bmN0aW9uXG4gKiBzaW1wbGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRva2VuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtmb3JjZV1cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbkNsYXNzTGlzdC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKHRva2VuLCBmb3JjZSkge1xuICBjaGVja1Rva2VuKHRva2VuLCAndG9nZ2xlJyk7XG5cbiAgdmFyIGhhc1Rva2VuID0gdGhpcy5jb250YWlucyh0b2tlbik7XG4gIHZhciBtZXRob2QgPSBoYXNUb2tlbiA/IChmb3JjZSAhPT0gdHJ1ZSAmJiAncmVtb3ZlJykgOiAoZm9yY2UgIT09IGZhbHNlICYmICdhZGQnKTtcblxuICBpZiAobWV0aG9kKSB7XG4gICAgdGhpc1ttZXRob2RdKHRva2VuKTtcbiAgfVxuXG4gIHJldHVybiAodHlwZW9mIGZvcmNlID09ICdib29sZWFuJyA/IGZvcmNlIDogIWhhc1Rva2VuKTtcbn07XG4iLCIvKiFcbiAqIGV2ZW50aWUgdjEuMC42XG4gKiBldmVudCBiaW5kaW5nIGhlbHBlclxuICogICBldmVudGllLmJpbmQoIGVsZW0sICdjbGljaycsIG15Rm4gKVxuICogICBldmVudGllLnVuYmluZCggZWxlbSwgJ2NsaWNrJywgbXlGbiApXG4gKiBNSVQgbGljZW5zZVxuICovXG5cbi8qanNoaW50IGJyb3dzZXI6IHRydWUsIHVuZGVmOiB0cnVlLCB1bnVzZWQ6IHRydWUgKi9cbi8qZ2xvYmFsIGRlZmluZTogZmFsc2UsIG1vZHVsZTogZmFsc2UgKi9cblxuKCBmdW5jdGlvbiggd2luZG93ICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2NFbGVtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG52YXIgYmluZCA9IGZ1bmN0aW9uKCkge307XG5cbmZ1bmN0aW9uIGdldElFRXZlbnQoIG9iaiApIHtcbiAgdmFyIGV2ZW50ID0gd2luZG93LmV2ZW50O1xuICAvLyBhZGQgZXZlbnQudGFyZ2V0XG4gIGV2ZW50LnRhcmdldCA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50IHx8IG9iajtcbiAgcmV0dXJuIGV2ZW50O1xufVxuXG5pZiAoIGRvY0VsZW0uYWRkRXZlbnRMaXN0ZW5lciApIHtcbiAgYmluZCA9IGZ1bmN0aW9uKCBvYmosIHR5cGUsIGZuICkge1xuICAgIG9iai5hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBmbiwgZmFsc2UgKTtcbiAgfTtcbn0gZWxzZSBpZiAoIGRvY0VsZW0uYXR0YWNoRXZlbnQgKSB7XG4gIGJpbmQgPSBmdW5jdGlvbiggb2JqLCB0eXBlLCBmbiApIHtcbiAgICBvYmpbIHR5cGUgKyBmbiBdID0gZm4uaGFuZGxlRXZlbnQgP1xuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBldmVudCA9IGdldElFRXZlbnQoIG9iaiApO1xuICAgICAgICBmbi5oYW5kbGVFdmVudC5jYWxsKCBmbiwgZXZlbnQgKTtcbiAgICAgIH0gOlxuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBldmVudCA9IGdldElFRXZlbnQoIG9iaiApO1xuICAgICAgICBmbi5jYWxsKCBvYmosIGV2ZW50ICk7XG4gICAgICB9O1xuICAgIG9iai5hdHRhY2hFdmVudCggXCJvblwiICsgdHlwZSwgb2JqWyB0eXBlICsgZm4gXSApO1xuICB9O1xufVxuXG52YXIgdW5iaW5kID0gZnVuY3Rpb24oKSB7fTtcblxuaWYgKCBkb2NFbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIgKSB7XG4gIHVuYmluZCA9IGZ1bmN0aW9uKCBvYmosIHR5cGUsIGZuICkge1xuICAgIG9iai5yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBmbiwgZmFsc2UgKTtcbiAgfTtcbn0gZWxzZSBpZiAoIGRvY0VsZW0uZGV0YWNoRXZlbnQgKSB7XG4gIHVuYmluZCA9IGZ1bmN0aW9uKCBvYmosIHR5cGUsIGZuICkge1xuICAgIG9iai5kZXRhY2hFdmVudCggXCJvblwiICsgdHlwZSwgb2JqWyB0eXBlICsgZm4gXSApO1xuICAgIHRyeSB7XG4gICAgICBkZWxldGUgb2JqWyB0eXBlICsgZm4gXTtcbiAgICB9IGNhdGNoICggZXJyICkge1xuICAgICAgLy8gY2FuJ3QgZGVsZXRlIHdpbmRvdyBvYmplY3QgcHJvcGVydGllc1xuICAgICAgb2JqWyB0eXBlICsgZm4gXSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG59XG5cbnZhciBldmVudGllID0ge1xuICBiaW5kOiBiaW5kLFxuICB1bmJpbmQ6IHVuYmluZFxufTtcblxuLy8gLS0tLS0gbW9kdWxlIGRlZmluaXRpb24gLS0tLS0gLy9cblxuaWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gIC8vIEFNRFxuICBkZWZpbmUoIGV2ZW50aWUgKTtcbn0gZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcbiAgLy8gQ29tbW9uSlNcbiAgbW9kdWxlLmV4cG9ydHMgPSBldmVudGllO1xufSBlbHNlIHtcbiAgLy8gYnJvd3NlciBnbG9iYWxcbiAgd2luZG93LmV2ZW50aWUgPSBldmVudGllO1xufVxuXG59KSggd2luZG93ICk7XG4iLCJpbXBvcnQgY2xhc3NMaXN0IGZyb20gJ2RvbS1jbGFzc2xpc3QnO1xuXG5leHBvcnQgZGVmYXVsdCAob3B0aW9ucykgPT4ge1xuICBjb25zdCBDT05UQUlORVJfQ0xBU1NfTkFNRSA9ICdzZi1jb250YWluZXInO1xuICBjb25zdCBCQVNFX0NMQVNTX05BTUUgPSAnc2YtYmxpbmsnO1xuICBjb25zdCBBTklNX0NMQVNTX05BTUUgPSAnc2YtYW4tYmxpbmsnO1xuICBjb25zdCBleGNsdWRlZENoYXJzID0gW1xuICAgICcnLFxuICAgICcgJyxcbiAgICAnXFxuJyxcbiAgICAnXFxyJyxcbiAgICAnXFx0J1xuICBdO1xuICBsZXQgaW50ZXJ2YWxEZWxheTtcbiAgbGV0IGludGVydmFsSWQ7XG4gIGxldCBjb250YWluZXJFbDtcbiAgbGV0IGlzUGF1c2VkO1xuXG4gIGNsYXNzIFNsaW1GYWR5IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7Li4ub3B0aW9uc307XG4gICAgICBjaGVja09wdGlvbnModGhpcy5vcHRpb25zKTtcblxuICAgICAgY29udGFpbmVyRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMub3B0aW9ucy5jb250YWluZXIpO1xuICAgICAgaWYgKGNvbnRhaW5lckVsID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYSBET00gZWxlbWVudCBieSB1c2luZyBzZWxlY3RvcjogJHtvcHRpb25zLmNvbnRhaW5lcn1gKTtcbiAgICAgIH1cbiAgICAgIGNsYXNzTGlzdChjb250YWluZXJFbCkucmVtb3ZlKENPTlRBSU5FUl9DTEFTU19OQU1FKTtcblxuICAgICAgaW50ZXJ2YWxEZWxheSA9IHRoaXMub3B0aW9ucy5kZWxheSB8fCAyMDtcblxuICAgICAgd3JhcChjb250YWluZXJFbCk7XG4gICAgfVxuXG4gICAgc3RhcnRBbmltYXRpb24oKSB7XG4gICAgICBpZiAodGhpcy5pc0FuaW1hdGluZygpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IHNlbGVjdG9yID0gYC4ke0JBU0VfQ0xBU1NfTkFNRX1gO1xuXG4gICAgICBpZiAoaXNQYXVzZWQgPT09IHRydWUpIHtcbiAgICAgICAgc2VsZWN0b3IgKz0gYDpub3QoLiR7QU5JTV9DTEFTU19OQU1FfSlgO1xuICAgICAgfVxuXG4gICAgICBpc1BhdXNlZCA9IGZhbHNlO1xuXG4gICAgICBjb25zdCBlbGVtZW50cyA9IGNvbnRhaW5lckVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgICAgdGhpczo6YW5pbWF0ZUVsZW1lbnRzKGVsZW1lbnRzKTtcbiAgICB9XG5cbiAgICBzdG9wQW5pbWF0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuaXNBbmltYXRpbmcoKSkge1xuICAgICAgICBpc1BhdXNlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJZCk7XG4gICAgICBpbnRlcnZhbElkID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNsZWFyQW5pbWF0aW9uKCkge1xuICAgICAgdGhpcy5zdG9wQW5pbWF0aW9uKCk7XG4gICAgICBpc1BhdXNlZCA9IGZhbHNlO1xuXG4gICAgICBjb25zdCBlbGVtZW50cyA9IHRvQXJyYXkoY29udGFpbmVyRWwucXVlcnlTZWxlY3RvckFsbChgLiR7QU5JTV9DTEFTU19OQU1FfWApKTtcbiAgICAgIGVsZW1lbnRzLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGNsYXNzTGlzdChlbCkucmVtb3ZlKEFOSU1fQ0xBU1NfTkFNRSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpc0FuaW1hdGluZygpIHtcbiAgICAgIHJldHVybiBpbnRlcnZhbElkICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXkuPEhUTUxFbGVtZW50PnxOb2RlTGlzdC48SFRNTEVsZW1lbnQ+fSBlbGVtZW50c1xuICAgKiBAdGhpcyBTbGltRmFkeVxuICAgKi9cbiAgZnVuY3Rpb24gYW5pbWF0ZUVsZW1lbnRzKGVsZW1lbnRzKSB7XG4gICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICAgICAgZWxlbWVudHMgPSB0b0FycmF5KGVsZW1lbnRzKTtcbiAgICB9XG5cbiAgICBpbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgY29uc3QgbGVuID0gZWxlbWVudHMubGVuZ3RoO1xuXG4gICAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICAgIHRoaXMuc3RvcEFuaW1hdGlvbigpO1xuICAgICAgICBpc1BhdXNlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGluZGV4ID0gcmFuZG9tSW50RnJvbVJhbmdlKDAsIGxlbiAtIDEpO1xuICAgICAgYW5pbWF0ZUVsZW1lbnQoZWxlbWVudHNbaW5kZXhdKTtcbiAgICAgIGVsZW1lbnRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfSwgaW50ZXJ2YWxEZWxheSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcbiAgICovXG4gIGZ1bmN0aW9uIGFuaW1hdGVFbGVtZW50KGVsKSB7XG4gICAgY2xhc3NMaXN0KGVsKS5hZGQoQU5JTV9DTEFTU19OQU1FKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgZnVuY3Rpb24gcmFuZG9tSW50RnJvbVJhbmdlKG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIH5+KE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbik7XG4gIH1cblxuICAvKipcbiAgICogQHRocm93cyB7RXJyb3J9XG4gICAqL1xuICBmdW5jdGlvbiBjaGVja09wdGlvbnMob3B0aW9ucykge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jb250YWluZXIgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFBsZWFzZSBzZXQgY29udGFpbmVyIG9wdGlvbiBhcyBhIHN0cmluZyBhbmQgdmFsaWQgc2VsZWN0b3IsIGdvdCAke3R5cGVvZiBvcHRpb25zLmNvbnRhaW5lcn1gKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5kZWxheSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvcHRpb25zLmRlbGF5ICE9PSAnbnVtYmVyJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQbGVhc2Ugc2V0IGRlbGF5IG9wdGlvbiBhcyBhIG51bWJlciwgZ290ICR7dHlwZW9mIG9wdGlvbnMuZGVsYXl9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyYXZlcnNlcyBkb3duIHN1YnRyZWUgb2YgcHJvdmlkZWQgZWxlbWVudCBhbmQgcGlja3Mgb25seSB0ZXh0IG5vZGVzLlxuICAgKiBFYWNoIGNoYXJhY3RlciBvZiB0ZXh0IG5vZGVzIGlzIHdyYXBwZWQgd2l0aCA8c3Bhbi4uLj4gZWxlbWVudC5cbiAgICogVGhpcyBtZXRob2QgYWRkcyBhbHNvIGF0dHJpYnV0ZSBhcmlhLWxhYmVsIGZvciBwcm92aWRlZCBlbGVtZW50LlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxuICAgKi9cbiAgZnVuY3Rpb24gd3JhcChlbCkge1xuICAgIGNvbnN0IHRleHROb2Rlc1RvV3JhcCA9IFtdO1xuICAgIHdhbGtUaGVET00oZWwsIChub2RlKSA9PiB7XG4gICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgbm9kZS50ZXh0Q29udGVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRleHROb2Rlc1RvV3JhcC5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGV4dE5vZGVzVG9XcmFwLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIGxldCBub2RlVG9TcGxpdCA9IG5vZGU7XG4gICAgICBjb25zdCB0ZXh0TGVuZ3RoID0gbm9kZS50ZXh0Q29udGVudC5sZW5ndGg7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dExlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIGlmIG5vZGVUb1NwbGl0IGlzIFwiQWJjZGVcIiAsIHRoZW5cbiAgICAgICAgLy8gbm9kZVRvU3BsaXQgPSBcIkFcIlxuICAgICAgICAvLyBzaWJsaW5nTm9kZSA9IFwiYmNkZVwiXG4gICAgICAgIC8vIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1RleHQvc3BsaXRUZXh0XG4gICAgICAgIGNvbnN0IHNpYmxpbmdOb2RlID0gbm9kZVRvU3BsaXQuc3BsaXRUZXh0KDEpO1xuXG4gICAgICAgIGlmIChpc0V4bHVkZWRDaGFyKG5vZGVUb1NwbGl0LnRleHRDb250ZW50KSkge1xuICAgICAgICAgIG5vZGVUb1NwbGl0ID0gc2libGluZ05vZGU7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB3cmFwcGVyID0gY3JlYXRlV3JhcHBlck5vZGUoKTtcblxuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKG5vZGVUb1NwbGl0LmNsb25lTm9kZShmYWxzZSkpO1xuICAgICAgICBub2RlVG9TcGxpdC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh3cmFwcGVyLCBub2RlVG9TcGxpdCk7XG5cbiAgICAgICAgbm9kZVRvU3BsaXQgPSBzaWJsaW5nTm9kZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGVsLnRleHRDb250ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYXV0aG9yIERvdWdsYXMgQ3JvY2tmb3JkXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgKiBAc2VlIGh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9WTJZMFUtMnFKTXMmZmVhdHVyZT15b3V0dS5iZSZ0PTI3bTE1c1xuICAgKi9cbiAgZnVuY3Rpb24gd2Fsa1RoZURPTShub2RlLCBmbikge1xuICAgIGZuKG5vZGUpO1xuICAgIG5vZGUgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgd2hpbGUobm9kZSkge1xuICAgICAgd2Fsa1RoZURPTShub2RlLCBmbik7XG4gICAgICBub2RlID0gbm9kZS5uZXh0U2libGluZztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlV3JhcHBlck5vZGUoKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB3cmFwcGVyLmNsYXNzTmFtZSA9IEJBU0VfQ0xBU1NfTkFNRTtcbiAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIHJldHVybiB3cmFwcGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTENvbGxlY3Rpb258Tm9kZUxpc3R9IGxpc3RcbiAgICogQHJldHVybnMge0FycmF5fVxuICAgKi9cbiAgZnVuY3Rpb24gdG9BcnJheShsaXN0KSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGxpc3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gaXNFeGx1ZGVkQ2hhcihjKSB7XG4gICAgcmV0dXJuIGV4Y2x1ZGVkQ2hhcnMuaW5kZXhPZihjKSA+IC0xO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTbGltRmFkeShvcHRpb25zKTtcbn07XG4iXX0=
