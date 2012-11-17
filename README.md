# shortcode.js

shortcode.js will enable you to parse Wordpress-style shortcodes in a page and replace it with anything you like. You could build a table of contents based on headings, embed a form, embed content from other pages, or insert a gallery. The possibilities are endless.

This is extremely powerful when combined with a WYSIWYM/G editor. A user editing a page could simply drop in a predefined shortcode and have rich functionality on the frontend.

shortcode.js ships with some default services. You may use them as you wish. Defining one with the same name will override an existing one.

## Usage

It takes a hash of methods where the keys are the shortcode. The item that you selected will have it's html replaced.

``` javascript
$('selector').shortcode({
  find_me: function(el, options, content) {
    return "replace with me";
  }
});
```

Each method accepts 3 arguments:

  * `el` - a reference to the selected element. Useful for scoping queries to further manipulate the DOM (see [Example C](#example-c)).
  * `options` - a hash of options created from attributes in the shortcode string
  * `content` - if you use a shortcode with a closing tag, the inner content will be available here

### Example A

Find `[gallery]` in `#main` and replace it with "Replacement content". Easy!

``` javascript
$("#main").shortcode({
  gallery: function() {
    return "Replacement content";
  }
});
```

### Example B

Find `[gallery id="123" size="medium"]` and replace with some html.

``` javascript
$("#main").shortcode({
  gallery: function(el, options) {
    return "<div id='" + options.id + "' data-size='" + options.size + "'></div>";
  }
});
```

### Example C

Find `[overview target="h2"]` and build a table of contents based on `h2`s in the page.

``` javascript
$("#main").shortcode({
  overview: function(el, options) {
    var $markup;

    options = $.extend({
      "target": "h2",
      "class": "overview"
    }, options);

    $markup = $("<nav class='" + options["class"] + "'>");

    $(options.target, el).each(function() {
      var text = $(this).text();;
          id = text.toLowerCase().replace(/[^\s\w]/g, '').replace(/\s/g, '-');

      $(this).attr('id', id);
      $markup.append("<a href='#" + id + "'>" + text + "</a>");
    });

    return $markup;
  }
});
```

### Example D

Use a shortcode with a closing tag ([content]Cool content[/content]).

``` javascript
$("#main").shortcode({
  content: function(el, options, content) {
    return "<p>" + content + "</p>";
  }
});
```

## Best Practices

  * You may find it useful to use the extend pattern in your method, especially if you want to define defaults for a shortcode. See [Example C](#example-c).

  * You may return either an html string, or a jQuery object. If you return nothing, no replacement will be made.