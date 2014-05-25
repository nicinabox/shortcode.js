# shortcode.js

Replace Wordpress-style shortcode strings with anything. jQuery not required.

Read more about [Shortcodes in Wordpress.](http://codex.wordpress.org/Shortcode)

## Usage

`Shortcode` accepts 2 arguments: an element, and an object of tags to match.

Each tag method returns a string to replace the original tag (in the DOM) and accepts 2 arguments: an object of parsed options, and an (optional) asynchronous callback.

### The basics

The shortcode `[hello text="Hello World!"]` will be replaced with `Hello World!`. Be sure to return something at the end!

```javascript
var shortcode = new Shortcode(document.querySelector('body'), {
  hello: function(options) {
    return options.text;
  }
});
```

### Asynchronous

Sometimes you need to do asynchronous work. Don't return anything from the shortcode method. Instead, use the `done` callback to update the DOM.

```javascript
var shortcode = new Shortcode(document.querySelector('body'), {
  hello: function(options, done) {
    setTimeout(function() {
      done(options.text);
    }, 1000);
  }
});
```

## jQuery

While shortcode.js doesn't rely on jQuery, you may find it convenient to use. Shortcode can accept a jQuery object or a DOM object as the first argument.

Alternatively, a jQuery plugin wrapper is supplied.

```javascript
$('body').shortcode({
  hello: function(options) {
    return options.text;
  }
})
```

## Gotchas

* shortcode.js does not support shortcodes with a start and end tag.

## License

MIT (c) 2014 Nic Aitch
