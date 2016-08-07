(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SlimFady = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.default = function (options) {
  var BASE_CLASS_NAME = 'sf-blink';
  var ANIM_CLASS_NAME = 'sf-an-blink';
  var excludedChars = ['', ' ', '\n', '\r', '\t'];
  var intervalDelay = 20;
  var intervalId = void 0;
  var containerEl = void 0;
  var isAnimating = void 0;

  var SlimFady = function () {
    function SlimFady(options) {
      _classCallCheck(this, SlimFady);

      this.options = _extends({}, options);
      checkOptions(this.options);

      containerEl = document.querySelector(this.options.container);
      if (containerEl === null) {
        throw new Error('Could not find a DOM element by using selector: ' + options.container);
      }

      wrap(containerEl);
    }

    _createClass(SlimFady, [{
      key: 'animate',
      value: function animate() {
        if (isAnimating === true) {
          return;
        }

        isAnimating = true;

        var elements = Array.prototype.slice.call(containerEl.querySelectorAll('.' + BASE_CLASS_NAME));
        if (elements.length === 0) {
          return;
        }

        intervalId = setInterval(function () {
          var len = elements.length;

          if (len === 0) {
            clearInterval(intervalId);
            isAnimating = false;
            return;
          }

          var index = randomIntFromRange(0, len - 1);
          animateElement(elements[index]);
          elements.splice(index, 1);
        }, intervalDelay);
      }
    }]);

    return SlimFady;
  }();

  /**
   * @param {HTMLElement} el
   */


  function animateElement(el) {
    el.className = ' ' + ANIM_CLASS_NAME;
  }

  /**
   * @returns {number}
   */
  function randomIntFromRange(min, max) {
    return ~~(Math.random() * (max - min) + min);
  }

  /**
   * @param {Object} options
   * @param {string} option
   * @returns {boolean}
   */
  function hasDefinedOption(options, option) {
    return options[option] !== undefined;
  }

  /**
   * @throws {Error}
   */
  function checkOptions(options) {
    if (!hasDefinedOption(options, 'container')) {
      throw new Error('Please set container option as a string and valid selector, got ' + _typeof(options.container));
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

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = textNodesToWrap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var node = _step.value;

        var textLength = node.textContent.length;
        var nodeToSplit = node;

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
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

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
   * @returns {boolean}
   */
  function isExludedChar(c) {
    return excludedChars.indexOf(c) > -1;
  }

  return new SlimFady(options);
};

module.exports = exports['default'];

},{}]},{},[1])(1)
});