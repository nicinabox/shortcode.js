/*
  shortcode.js 0.9.1
  Replace Wordpress-style shortcodes with HTML on the fly
  by Nic Aitch @nicinabox
  MIT License
*/

(function() {

    $.fn.shortcode = function(services) {
        var run;
        services = $.extend({}, $.fn.shortcode.services, services);
        run = function(code, options, content, el) {
            return services[code](el, options, content);
        };
        return this.each(function() {
            var html, replacement,
                _this = this;
            html = $(this).html();
            replacement = '';
            return $.each(services, function(shortcode) {

                var content, crude_options, match, options, regex, regexs;
                regexs = ["\\[" + shortcode + "(.*?)\\](.*?)?\\[\\/" + shortcode + "\\]", "\\[" + shortcode + "(.*?)?\\]"];
                options = {};
                crude_options = '';
                content = '';
                match = [];
                regex = '';
                $.each(regexs, function(i) {
                    regex = new RegExp(regexs[i], "g");
                    var match;
                    do {
                        match = regex.exec(html);
                        if (match) {

                            if (match[1]) {
                                crude_options = $.trim(match[1]).split(' ');
                            }
                            if (match[2]) {
                                content = $.trim(match[2]);
                            }
                            $.each(crude_options, function(i) {
                                var opts;
                                opts = crude_options[i].split("=");
                                options[opts[0]] = opts[1].replace(/"/g, '');
                            });
                            replacement = run(shortcode, options, content, _this);
                            html = $(_this).html();
                            if (replacement) {
                                if (replacement.jquery) {
                                    replacement = replacement[0].outerHTML;
                                }
                                html = html.replace(match[0], replacement);
                                $(_this).html(html);

                            }
                        }
                    } while (match);
                });
            });
        });
    };

}).call(this);
