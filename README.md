# [shortcode.js](https://github.com/nicinabox/shortcode.js)

Replace [Wordpress-style shortcodes](http://codex.wordpress.org/Shortcode) with anything. No dependencies required.

## Usage

`Shortcode` accepts 2 arguments: an element, and an object of tags to match.

Each tag method returns a string to replace the original tag (in the DOM) and accepts an (optional) asynchronous callback. `this` is bound to the match object.

```javascript
/* Replaces [hello text="Hello world"] in `body` with "Hello world" */
new Shortcode(document.querySelector('body'), {
  hello: function() {
    return this.options.text;
  }
});
```

Tip: Because shortcode replaces an element's html, you will lose existing event bindings inside that element. Use delegated bindings where possible and call shortcode at the start of your code.

## Features

* Supports multiple tag instances
* Supports single and start-end tags
* Supports multi-line tags
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
new Shortcode(document.querySelector('body'), {
  hello: function(done) {
    var self = this;

    /* setTimeout is used here to simulate an async event */
    setTimeout(function() {
      done(self.options.text);
    }, 1000);
  }
});
```

## Start and end tags

Shortcode.js supports tags like `[note]This is a note[/note]`. The content between tags will be availble in your callback under `this.contents`.

```javascript
new Shortcode(document.querySelector('body'), {
  note: function(done) {
    return this.contents;
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
});
```

## Releases

See [Releases](https://github.com/nicinabox/shortcode.js/releases) for current version and release notes.

## Contributing and dev setup

See `CONTRIBUTING.md`

## License

MIT (c) 2014 Nic Aitch
