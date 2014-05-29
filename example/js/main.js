$(function() {
  var $el = $('body');
  var readmePath = window.location.hostname === 'localhost' ?
    '../../README.md' : 'README.md';
  var xhr = $.get(readmePath);

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
    var $contents = $(marked(data));
    var $heading = $contents.splice(0, 3);

    $('#root').prepend($heading);
    $('.readme').html($contents);

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

$(document).on('click', '.view-source', function(e) {
  e.preventDefault();
  window.location = 'view-source:' + window.location.href;
});
