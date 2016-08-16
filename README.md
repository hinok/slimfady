[![Build Status](https://travis-ci.org/hinok/slimfady.svg?branch=master)](https://travis-ci.org/hinok/slimfady)
[![Coverage Status](https://coveralls.io/repos/github/hinok/slimfady/badge.svg?branch=master)](https://coveralls.io/github/hinok/slimfady?branch=master)
[![npm version](https://badge.fury.io/js/slimfady.svg)](https://badge.fury.io/js/slimfady)
[![GitHub version](https://badge.fury.io/gh/hinok%2Fslimfady.svg)](https://badge.fury.io/gh/hinok%2Fslimfady)

# SlimFady
Randomly delay revealing of each character in a text (uses CSS3 animation).

- Doesn't remove HTML tags of animated text
- No extra dependencies

## Demo ([codepen.io](http://codepen.io/hinok/pen/zByWOA))

![SlimFady](/demo/assets/demo.gif?raw=true)

## Getting started

```
npm install slimfady --save
```

### JS

```javascript
import SlimFady from 'slimfady';

const options = {
    container: '#foo'
    delay: 50
};

const sf = new SlimFady(options);
```

### CSS

```css
// CSS
<link rel="stylesheet" href="node_modules/slimfady/dist/style.css">

// or import the stylesheet in a CSS pre-processor
@import 'node_modules/slimfady/dist/style.css';
```

### DOM

```html
<!DOCTYPE html>
<html>
  <head>  
  </head>
  <body>
    <div id="test" class="sf-container">hello</div>
  </body>
</html>
```

## API

## Options

```
{
    container: '#foo'
    delay: 50
}
```

### `options.container`, string, required

CSS selector of a single DOM node.

### `options.delay`, number, optional, default = 20

Defines time range between starting animation of each character, smaller value => faster animation.

## Methods

### sf.startAnimation()

### sf.stopAnimation()
Stops and also pauses animation if it's still in progress. If you would like to remove animation 
and reveal the whole text immediately, use `clearAnimation()`.

### sf.isAnimating()

### sf.clearAnimation()
Removes animation and reveals the whole text. It doesn't remove newly created `<span>` elements.
After calling `clearAnimation()`, you can easily start animation from the beginning by using
 `startAnimation()`.

## License

MIT
