###
  shortcode.js 0.9.1
  Replace Wordpress-style shortcodes with HTML on the fly
  by Nic Aitch @nicinabox
  MIT License
###

$.fn.shortcode = (services) ->

  # Extend from external or arguments
  services = $.extend {}, $.fn.shortcode.services, services

  run = (code, options, content, el) ->
    services[code](el, options, content)

  this.each ->
    html        = $(this).html()
    replacement = ''

    # Loop through all services
    $.each services, (shortcode) =>

      # The key is what we want to match
      regexs  = [
        "\\[#{shortcode}(.*?)?\\](.*)?\\[\\/#{shortcode}\\]"
        "\\[#{shortcode}(.*?)?\\]"
      ]

      options       = {}
      crude_options = ''
      content       = ''
      match         = []
      regex         = ''

      # Parse options from capture group
      $.each regexs, (i) ->
        regex = new RegExp regexs[i], "g"
        match = regex.exec html
        return false if match

      if match
        crude_options = $.trim(match[1]).split(' ') if match[1]
        content       = $.trim(match[2])            if match[2]

        $.each crude_options, (i) ->
          opts             = crude_options[i].split("=")
          options[opts[0]] = opts[1].replace(/"/g, '')

      # Run shortcode function for replacement
      replacement = run shortcode, options, content, this

      # Recapture html in case shortcode changed the DOM
      html = $(this).html()

      # Handle returned jQuery object
      if replacement
        if replacement.jquery
          replacement = replacement[0].outerHTML

        # Replace shortcode and inject into DOM
        html = html.replace(regex, replacement)
        $(this).html html