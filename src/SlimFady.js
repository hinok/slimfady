import classList from 'dom-classlist';

export default (options) => {
  const CONTAINER_CLASS_NAME = 'sf-container';
  const BASE_CLASS_NAME = 'sf-blink';
  const ANIM_CLASS_NAME = 'sf-an-blink';
  const excludedChars = [
    '',
    ' ',
    '\n',
    '\r',
    '\t'
  ];
  let intervalDelay;
  let intervalId;
  let containerEl;
  let isPaused;

  class SlimFady {
    constructor(options) {
      this.options = {...options};
      checkOptions(this.options);

      containerEl = document.querySelector(this.options.container);
      if (containerEl === null) {
        throw new Error(`Could not find a DOM element by using selector: ${options.container}`);
      }
      classList(containerEl).remove(CONTAINER_CLASS_NAME);

      intervalDelay = this.options.delay || 20;

      wrap(containerEl);
    }

    startAnimation() {
      if (this.isAnimating()) {
        return;
      }

      let selector = `.${BASE_CLASS_NAME}`;

      if (isPaused === true) {
        selector += `:not(.${ANIM_CLASS_NAME})`;
      }

      isPaused = false;

      const elements = containerEl.querySelectorAll(selector);
      this::animateElements(elements);
    }

    stopAnimation() {
      if (this.isAnimating()) {
        isPaused = true;
      }

      clearInterval(intervalId);
      intervalId = undefined;
    }

    clearAnimation() {
      this.stopAnimation();
      isPaused = false;

      const elements = containerEl.querySelectorAll(`.${ANIM_CLASS_NAME}`);
      for (let el of elements) {
        classList(el).remove(ANIM_CLASS_NAME);
      }
    }

    isAnimating() {
      return intervalId !== undefined;
    }
  }

  /**
   * @param {Array.<HTMLElement>|NodeList.<HTMLElement>} elements
   * @this SlimFady
   */
  function animateElements(elements) {
    if (elements.length === 0) {
      return;
    }

    if (!Array.isArray(elements)) {
        elements = Array.from(elements);
    }

    intervalId = setInterval(() => {
      const len = elements.length;

      if (len === 0) {
        this.stopAnimation();
        isPaused = false;
        return;
      }

      const index = randomIntFromRange(0, len - 1);
      animateElement(elements[index]);
      elements.splice(index, 1);
    }, intervalDelay);
  }

  /**
   * @param {HTMLElement} el
   */
  function animateElement(el) {
    classList(el).add(ANIM_CLASS_NAME);
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
      throw new Error(`Please set container option as a string and valid selector, got ${typeof options.container}`);
    }

    if (options.delay !== undefined && typeof options.delay !== 'number') {
      throw new Error(`Please set delay option as a number, got ${typeof options.delay}`);
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
