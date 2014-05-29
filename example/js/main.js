$(function() {
  var $el = $('body');
  var xhr = $.get('../../README.md');

  // We need a server to load the readme
  xhr.fail(function() {
    if (window.location.origin === 'file://') {
      var message = '<div class="error">' +
          '<h1>Ooof</h1>' +
          'Please start an http server to view this example: <br>' +
          '<code>python -m SimpleHTTPServer</code>' +
        '</div>';

      $('#root').html(message);
    }
  });

  xhr.done(function(data) {
    // Insert the readme
    $('.readme').html(marked(data));

    // The real shortcode example:
    // Find all h2's and create a table of contents from them
    new Shortcode($el, {
      overview: function(options) {
        var $toc = $($('#toc').html());

        $el.find(options.target).each(function(index, el) {
          var text = $(el).text();
          var id = text.toLowerCase().replace(' ', '-');

          $(this).attr('id', id);
          $toc.find('ul').append(
            $('<li>').append($('<a>', {
              text: text,
              href: '#' + id
            }))
          );
        });

        return $toc;
      }
    });

  });

});
