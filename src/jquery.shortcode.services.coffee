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

  wufoo: (options, el) ->
    options = $.merge
      userName: options.username,
      formHash: options.formhash,
      async   : true
    , options

    delete options.username;
    delete options.formhash;

    script = document.createElement('script')
    script.src = ((if "https:" is document.location.protocol then "https://" else "http://")) + "wufoo.com/scripts/embed/form.js"
    script.onload = script.onreadystatechange = ->
      rs = @readyState
      return if rs != "loaded" if rs != "complete" if rs
      try
        form = new WufooForm()
        form.initialize options
        form.display()

    scr = document.getElementsByTagName('script')[0]
    par = scr.parentNode
    par.insertBefore script, scr

    markup =
      "<div id='wufoo-#{options.formHash}'>" +
        "Fill out my <a href='http://#{options.userName}.wufoo.com/forms/#{options.formHash}'>online form</a>." +
      "</div>"

    markup
