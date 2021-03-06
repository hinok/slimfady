(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SlimFady = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

},{}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _domClasslist = _dereq_('dom-classlist');

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

},{"dom-classlist":1}]},{},[2])(2)
});