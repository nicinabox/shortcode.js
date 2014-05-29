# [shortcode.js](https://github.com/nicinabox/shortcode.js)

Replace [Wordpress-style shortcodes](http://codex.wordpress.org/Shortcode) with anything. No dependencies required.

## Usage

`Shortcode` accepts 2 arguments: an element, and an object of tags to match.

Each tag method returns a string to replace the original tag (in the DOM) and accepts an (optional) asynchronous callback. `this` is bound to the match object.

```javascript
// Replaces [hello text="Hello world"] in `body` with "Hello world"
new Shortcode(document.querySelector('body'), {
  hello: function() {
    return this.options.text;
  }
}
```

## Features

* Supports multiple tag instances
* Supports asynchronous callbacks
* Supports DOM or jQuery selectors
* Includes jQuery plugin definition
* Ignores tags inside `pre` and `code`
* Tested with Jasmine

## Supported browsers

Shortcode.js should work in any browser that supports `Function.prototype.bind` (Sorry IE7 & 8). If you need to support <IE9, try the [polyfill published in MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility).

## Using async

Sometimes you need to do asynchronous work. Don't return anything from the shortcode method. Instead, call `done` with your return value to update the DOM.

```javascript
var shortcode = new Shortcode(document.querySelector('body'), {
  hello: function(done) {
    var self = this;
    setTimeout(function() {
      done(self.options.text);
    }, 1000);
  }
});
```

## jQuery

While shortcode.js doesn't rely on jQuery, you may find it convenient to use. Shortcode can accept a jQuery object or a DOM object as the first argument.

Alternatively, a jQuery plugin wrapper is supplied.

```javascript
$('body').shortcode({
  hello: function() {
    return this.options.text;
  }
})
```

## Gotchas

* shortcode.js does not support shortcodes with a start and end tag.

## Contributing and dev setup

See `CONTRIBUTING.md`

## License

MIT (c) 2014 Nic Aitch
