import docReady from 'doc-ready';
import SlimFady from '../src/SlimFady';

docReady(() => {
  const sf1 = new SlimFady({
    container: '.js-demo-1'
  });

  const sf2 = new SlimFady({
    container: '.js-demo-2'
  });

  sf1.animate();
  sf2.animate();
});
