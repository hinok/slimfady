import docReady from 'doc-ready';
import SlimFady from '../src/SlimFady';

docReady(() => {
  const sf = new SlimFady({
    container: '.js-demo-controls',
    delay: 80
  });
  const start = document.querySelector('.js-start');
  const stop = document.querySelector('.js-stop');
  const clear = document.querySelector('.js-clear');

  start.addEventListener('click', () => sf.startAnimation());
  stop.addEventListener('click', () => sf.stopAnimation());
  clear.addEventListener('click', () => sf.clearAnimation());

  const sf1 = new SlimFady({
    container: '.js-demo-1'
  });

  const sf2 = new SlimFady({
    container: '.js-demo-2'
  });

  sf1.startAnimation();
  sf2.startAnimation();
});
