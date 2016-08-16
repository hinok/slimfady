import {expect} from 'chai';
import sinon from 'sinon';
import jsdomify from 'jsdomify';
import SlimFady from './SlimFady';

const expectThrow = (klass, options) => expect(klass.bind(klass, options));

describe('SlimFady', () => {

  const CONTAINER_CLASS_NAME = 'sf-container';
  const BASE_CLASS_NAME = 'sf-blink';
  const ANIM_CLASS_NAME = 'sf-an-blink';

  const dom = `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        <div id="test" class="${CONTAINER_CLASS_NAME}">hello</div>
      </body>
    </html>
  `;

  const domAdvanced = `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        <div id="test" class="${CONTAINER_CLASS_NAME}">
          <strong>h</strong><div>e</div><a href="#">llo</a>
        </div>
      </body>
    </html>
  `;

  const options = {
    container: '#test'
  };

  const hasClass = (el, klass) => el.classList.contains(klass);
  const getContainer = () => document.querySelector('#test');
  const getWrappedElements = () => document.querySelectorAll('#test span');
  const getAnimatedElementsNumber = () => {
    const wrapped = Array.from(getWrappedElements());
    const classes = wrapped.filter((el) => hasClass(el, ANIM_CLASS_NAME));
    return classes.length;
  };

  beforeEach(() => jsdomify.create(dom));
  afterEach(() => jsdomify.destroy());

  describe('When passing options object', () => {
    it ('should NOT mutate passed options object', () => {
      const sf = new SlimFady(options);
      expect(sf.options).to.not.equal(options);

      sf.options.container = '#foo';
      expect(options.container).to.equal('#test');
    });

    it('should throw an error if container property does NOT exist in options object', () => {
      expectThrow(SlimFady, {foo: 'bar'}).to.throw(Error, /Please set container option/);
    });

    it('should throw an error if container property exists in options object but does NOT exist in DOM', () => {
      expectThrow(SlimFady, {container: '#foo'}).to.throw(Error, /Could not find a DOM element/);
    });

    it('should throw an error if delay property exists in options object and it is NOT a string', () => {
      const options = {
        container: '#test',
        delay: () => {}
      };
      expectThrow(SlimFady, options).to.throw(Error, /Please set delay option as a number/);
    });

    it('should create an instance of SlimFady if options object is correct without trowing an error', () => {
      expectThrow(SlimFady, options).not.to.throw(Error);
    });
  });

  describe('While creating an instance of SlimFady', () => {
    it('should remove container class', () => {
      const el = getContainer();

      expect(hasClass(el, CONTAINER_CLASS_NAME)).to.equal(true);
      const sf = new SlimFady(options);
      expect(hasClass(el, CONTAINER_CLASS_NAME)).to.equal(false)
    });

    it('should wrap each character with special span element', () => {
      expect(getWrappedElements().length).to.equal(0);
      const sf = new SlimFady(options);
      expect(getWrappedElements().length).to.equal(5);
    });
  });

  describe('While wrapping each character with span element', () => {
    it(`should append to each span element class ${BASE_CLASS_NAME}`, () => {
      const sf = new SlimFady(options);
      const wrapped = Array.from(getWrappedElements());
      const classes = wrapped.filter((el) => hasClass(el, BASE_CLASS_NAME));
      expect(classes.length).to.equal(5);
    });

    it('should append to each span element aria-hidden attribute', () => {
      const sf = SlimFady(options);
      const wrapped = Array.from(getWrappedElements());
      const attrs = wrapped.filter((el) => el.hasAttribute('aria-hidden') && el.getAttribute('aria-hidden') === 'true');
      expect(attrs.length).to.equal(5);
    });

    it('should preserve and does NOT remove html tags', () => {
      jsdomify.destroy();
      jsdomify.create(domAdvanced);
      const sf = new SlimFady(options);
      expect(getWrappedElements().length).to.equal(5);
      expect(document.querySelectorAll('#test strong').length).to.equal(1);
      expect(document.querySelectorAll('#test div').length).to.equal(1);
      expect(document.querySelectorAll('#test a').length).to.equal(1);
    });

    it('should append aria-label attribute to the container element', () => {
      expect(getContainer().hasAttribute('aria-label')).to.equal(false);
      const sf = SlimFady(options);
      expect(getContainer().hasAttribute('aria-label')).to.equal(true);
      expect(getContainer().getAttribute('aria-label')).to.equal('hello');
    });
  });

  describe('When created', () => {
    it('should NOT start animation automatically', () => {
      const sf = new SlimFady(options);
      const wrapped = Array.from(getWrappedElements());
      const classes = wrapped.filter((el) => hasClass(el, ANIM_CLASS_NAME));
      expect(classes.length).to.equal(0);
      expect(sf.isAnimating()).to.equal(false);
    });

    it('should allow for clearing animation at any time', () => {
      const clock = sinon.useFakeTimers();
      const sf = new SlimFady({...options, delay: 50});
      const spies = {
        isAnimating: sinon.spy(sf, 'isAnimating'),
        stopAnimation: sinon.spy(sf, 'stopAnimation')
      };

      sf.startAnimation();

      clock.tick(100);
      expect(getAnimatedElementsNumber()).to.equal(2);

      sf.clearAnimation();
      expect(getAnimatedElementsNumber()).to.equal(0);
      expect(spies.isAnimating.callCount).to.equal(2);
      expect(spies.stopAnimation.calledOnce).to.equal(true);

      clock.restore();
    });
  });

  describe('When animation has been cleared', () => {
    it('should allow for starting animation from the beginning', () => {
      const clock = sinon.useFakeTimers();
      const sf = new SlimFady({...options, delay: 50});

      sf.startAnimation();
      clock.tick(100);
      expect(getAnimatedElementsNumber()).to.equal(2);
      sf.clearAnimation();
      expect(sf.isAnimating()).to.equal(false);

      sf.startAnimation();
      expect(sf.isAnimating()).to.equal(true);
      clock.tick(150);
      expect(getAnimatedElementsNumber()).to.equal(3);

      clock.restore();
    });
  });

  describe('When animation is NOT in progress', () => {
    it('should start animation', () => {
      const clock = sinon.useFakeTimers();
      const sf = new SlimFady({...options, delay: 50});
      const stub = sinon.stub(sf, 'isAnimating', () => false);
      const spy = sinon.spy(sf, 'stopAnimation');

      sf.startAnimation();

      expect(stub.calledOnce).to.equal(true);

      for (let i = 1; i <= 5; i++) {
        clock.tick(50);
        expect(getAnimatedElementsNumber()).to.equal(i);
        expect(spy.called).to.equal(false);
      }

      // Next tick for clearing interval
      // and call stopAnimation()
      clock.tick(50);
      expect(spy.called).to.equal(true);
      clock.restore();
    });
  });

  describe('When animation is in progress', () => {
    it('should NOT allow for starting new animation', () => {
      const clock = sinon.useFakeTimers();
      const sf = new SlimFady({...options, delay: 50});
      const stub = sinon.stub(sf, 'isAnimating', () => true);
      const spy = sinon.spy(sf, 'stopAnimation');

      sf.startAnimation();

      clock.tick(500);
      expect(stub.calledOnce).to.equal(true);
      expect(getAnimatedElementsNumber()).to.equal(0);
      expect(spy.called).to.equal(false);

      clock.restore();
    });

    it('can be paused and restored', () => {
      const clock = sinon.useFakeTimers();
      const sf = new SlimFady({...options, delay: 50});
      const spies = {
        isAnimating: sinon.spy(sf, 'isAnimating'),
        stopAnimation: sinon.spy(sf, 'stopAnimation')
      };

      sf.startAnimation();
      expect(spies.isAnimating.calledOnce).to.equal(true);

      clock.tick(100);
      expect(getAnimatedElementsNumber()).to.equal(2);
      sf.stopAnimation();
      clock.tick(500);
      expect(getAnimatedElementsNumber()).to.equal(2);
      sf.startAnimation();
      clock.tick(100);
      expect(getAnimatedElementsNumber()).to.equal(4);
      clock.tick(100);
      expect(getAnimatedElementsNumber()).to.equal(5);


      expect(spies.isAnimating.callCount).to.equal(4);
      expect(spies.stopAnimation.callCount).to.equal(2);

      clock.restore();
    });
  });

  describe('When animation has been completed', () => {
    it(`All characters should have ${ANIM_CLASS_NAME} class`, () => {
      const clock = sinon.useFakeTimers();
      const sf = new SlimFady({...options, delay: 50});
      sf.startAnimation();

      clock.tick(500);
      expect(getAnimatedElementsNumber()).to.equal(5);

      clock.restore();
    });
  });

});
