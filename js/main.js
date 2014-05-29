$(function() {
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
  });
});

$(document).on('click', '.view-source', function(e) {
  e.preventDefault();
  window.location = 'view-source:' + window.location.href;
});
