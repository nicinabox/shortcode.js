###
  Shortcode.js 1.0
  Replace Wordpress-style shortcodes with HTML on the fly
  by Nic Aitch @nicinabox
###

$.fn.shortcode = (services) ->

  # Extend from external or arguments
  services = $.extend {}, $.fn.shortcode.services, services

  run = (code, options, el) ->
    services[code](options, el)

  this.each ->
    html        = $(this).html()
    replacement = ''

    # Loop through all services
    $.each services, (shortcode) =>

      # The key is what we want to match
      regex   = new RegExp "\\[#{shortcode}(.*?)?\\]", "g"
      options = {}

      # Parse options from capture group
      match = regex.exec html
      if match[1]
        crude_options = $.trim(match[1]).split(' ')

        $.each crude_options, (i) ->
          opts             = crude_options[i].split("=")
          options[opts[0]] = opts[1].replace(/"/g, '')

      # Run shortcode function for replacement
      replacement = run shortcode, options, this

      # Recapture html in case shortcode changed the DOM
      html = $(this).html()

      # Handle returned jQuery object
      if replacement.jquery
        replacement = replacement[0].outerHTML

      # Replace shortcode and inject into DOM
      if replacement
        html = html.replace(regex, replacement)
        $(this).html html