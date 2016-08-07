export default (options) => {
  const BASE_CLASS_NAME = 'sf-blink';
  const ANIM_CLASS_NAME = 'sf-an-blink';
  const excludedChars = [
    '',
    ' ',
    '\n',
    '\r',
    '\t'
  ];
  let intervalDelay = 20;
  let intervalId;
  let containerEl;
  let isAnimating;

  class SlimFady {
    constructor(options) {
      this.options = {...options};
      checkOptions(this.options);

      containerEl = document.querySelector(this.options.container);
      if (containerEl === null) {
        throw new Error(`Could not find a DOM element by using selector: ${options.container}`);
      }

      wrap(containerEl);
    }

    animate() {
      if (isAnimating === true) {
        return;
      }

      isAnimating = true;

      let elements = Array.prototype.slice.call(containerEl.querySelectorAll('.' + BASE_CLASS_NAME));
      if (elements.length === 0) {
        return;
      }

      intervalId = setInterval(() => {
        const len = elements.length;

        if (len === 0) {
          clearInterval(intervalId);
          isAnimating = false;
          return;
        }

        const index = randomIntFromRange(0, len - 1);
        animateElement(elements[index]);
        elements.splice(index, 1);
      }, intervalDelay);
    }
  }

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
      throw new Error(`Please set container option as a string and valid selector, got ${typeof options.container}`);
    }
  }

  /**
   * Traverses down subtree of provided element and picks only text nodes.
   * Each character of text nodes is wrapped with <span...> element.
   * This method adds also attribute aria-label for provided element.
   * @param {HTMLElement} el
   */
  function wrap(el) {
    const textNodesToWrap = [];
    walkTheDOM(el, (node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.length > 0) {
        textNodesToWrap.push(node);
      }
    });

    for (let node of textNodesToWrap) {
      const textLength = node.textContent.length;
      let nodeToSplit = node;

      for (let i = 0; i < textLength; i++) {
        // if nodeToSplit is "Abcde" , then
        // nodeToSplit = "A"
        // siblingNode = "bcde"
        // @see https://developer.mozilla.org/en-US/docs/Web/API/Text/splitText
        const siblingNode = nodeToSplit.splitText(1);

        if (isExludedChar(nodeToSplit.textContent)) {
          nodeToSplit = siblingNode;
          continue;
        }

        const wrapper = createWrapperNode();

        wrapper.appendChild(nodeToSplit.cloneNode(false));
        nodeToSplit.parentNode.replaceChild(wrapper, nodeToSplit);

        nodeToSplit = siblingNode;
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
    while(node) {
      walkTheDOM(node, fn);
      node = node.nextSibling;
    }
  }

  /**
   * @returns {HTMLElement}
   */
  function createWrapperNode() {
    const wrapper = document.createElement('span');
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
