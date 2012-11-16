$.fn.shortcode.services =
  overview: (options, el) ->
    options = $.extend
      target: "h2"
      class: "overview"
    , options

    $markup = $("<nav class='#{options.class}'>");

    $(options.target, el).each ->
      text = $(this).text()
      id   = text
              .toLowerCase()
              .replace(/[^\s\w]/g, '') # Remove non-word characters
              .replace(/\s/g, '-')     # Replace spaces with hyphens
      $(this).attr('id', id)
      $markup.append("<a href='##{id}'>#{text}</a>");

    $markup