###
  Shortcode.js 1.0
  Replace Wordpress style shortcodes with HTML on the fly
  by Nic Aitch @nicinabox
###

$.fn.shortcode = (services)->
  services = $.extend {}, services

  run = (code, options, el) ->
    services[code](options, el)

  this.each ->
    html = $(this).html()
    replace_with = ''

    $.each services, (shortcode) =>
      regex = new RegExp "\\[#{shortcode}(.*?)?\\]", "g"
      options = {}

      match = regex.exec html
      if match[1]
        crude_options = $.trim(match[1]).split(' ')

        $.each crude_options, (i) ->
          opts = crude_options[i].split("=")
          options[opts[0]] = opts[1].replace(/"/g, '')

      replace_with = run shortcode, options, this

      if replace_with.jquery
        replace_with = replace_with[0].outerHTML

      else if typeof replace_with == "object"
        html = replace_with.html
        replace_with = replace_with.replacement

      if replace_with
        html = html.replace(regex, replace_with)

    $(this).html html