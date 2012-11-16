$.fn.shortcode.services =
  overview: (options, el) ->
    $markup = $("<nav class='replacement'></nav>");
    $(options.el, el).each ->
      text = $(this).text()
      id   = text
              .toLowerCase()
              .replace(/[^\s\w]/g, '')
              .replace(/\s/g, '-')
      $(this).attr('id', id)
      $markup.append("<a href='##{id}'>#{text}</a>");
    $markup