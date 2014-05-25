/* jshint strict: false, unused: false */

var Shortcode = function(el, tags) {
  if (!el && !tags) { return; }

  this.el      = el;
  this.tags    = tags;
  this.matches = {};
  this.regex   = '\\[{tag}(.*?)?\\]';

  if (this.el.jquery) {
    this.el = this.el[0];
  }

  this.matchTags();
  this.replaceMatches();
};

Shortcode.prototype.matchTags = function() {
  var html = this.el.outerHTML;

  for (var key in this.tags) {
    if (!this.tags.hasOwnProperty(key)) { return; }

    var regex = new RegExp(this.template(this.regex, {
      tag: key
    }));

    var match = html.match(regex);
    if (match) {
      this.matches[key] = {
        tag: key,
        options: this.parseTagOptions(match[1]),
        regex: match[0]
      };
    }
  }
};

Shortcode.prototype.replaceMatches = function() {
  var self = this,
      html = this.el.innerHTML;

  var done = function(result) {
    html = html.replace(self.matches[key].regex, result);
    self.el.innerHTML = html;
  };

  for (var key in this.matches) {
    if (!this.matches.hasOwnProperty(key)) { return; }

    var result = this.tags[key](this.matches[key].options, done);

    if (result) {
      done(result);
    }
  }
};

Shortcode.prototype.parseTagOptions = function(stringOptions) {
  var options = {}, set;
  if (!stringOptions) { return; }

  set = stringOptions
          .replace(/(\w+=)/g, '\n$1')
          .split('\n');
  set.shift();

  for (var i = 0; i < set.length; i++) {
    var kv = set[i].split('=');
    options[kv[0]] = kv[1].replace(/\'|\"/g, '');
  }

  return options;
};

Shortcode.prototype.template = function (s, d) {
  for (var p in d) {
    s = s.replace(new RegExp('{' + p + '}','g'), d[p]);
  }
  return s;
};

// jQuery plugin wrapper
if (window.jQuery) {
  var pluginName = 'shortcode';
  $.fn[pluginName] = function (tags) {
    this.each(function() {
      if (!$.data(this, pluginName)) {
        $.data(this, pluginName, new Shortcode(this, tags));
      }
    });
    return this;
  };
}
