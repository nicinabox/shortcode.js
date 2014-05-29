/* jshint strict: false, unused: false */

// TODO: convert each match to node for faster iteration
// TODO: don't convert nodes inside code or pre
// TODO: support multiple instances of a tag

var Shortcode = function(el, tags) {
  if (!el) { return; }

  this.el      = el;
  this.tags    = tags;
  this.matches = [];
  this.regex   = '\\[{tag}(.*?)?\\]';

  if (this.el.jquery) {
    this.el = this.el[0];
  }

  this.matchTags();
  this.convertMatchesToNodes();
  this.replaceNodes();
};

Shortcode.prototype.matchTags = function() {
  var html = this.el.outerHTML;

  for (var key in this.tags) {
    if (!this.tags.hasOwnProperty(key)) { return; }
    var re = this.template(this.regex, {
      tag: key
    });

    var instancesRegex = new RegExp(re, 'g');
    var instances = html.match(instancesRegex) || [];

    for (var i = 0, len = instances.length; i < len; i++) {
      var optionsRegex = new RegExp(re);

      var match = instances[i].match(optionsRegex);

      if (match) {
        this.matches.push({
          tag: key,
          regex: match[0],
          options: this.parseTagOptions(match[1])
        });
      }
    }
  }
};

Shortcode.prototype.convertMatchesToNodes = function() {
  var html = this.el.innerHTML, node,
    replacer = function(match, p1) {
      if (p1) { return match; }
      else {    return node.outerHTML; }
    };

  for (var i = 0, len = this.matches.length; i < len; i++) {
    node = document.createElement('span');
    node.setAttribute('data-regex', this.matches[i].regex);
    node.className = 'node-' + this.matches[i].tag;

    var re = new RegExp('(data-regex=")?' + this.escapeRegExp(this.matches[i].regex), 'g');
    html = html.replace(re, replacer);
  }

  this.el.innerHTML = html;
};

Shortcode.prototype.replaceNodes = function() {
  var self = this, html, match, result, i, len, tag, done;

  var replacer = function(result) {
    var node = document.querySelector('.node-' + this.tag);

    if (result.jquery) { result = result[0]; }

    if (typeof result === 'string') {
      result = document.createTextNode(result);
    }

    if (node.dataset.regex === this.regex) {
      node.parentNode.replaceChild(result, node);
    }
  };

  for (i = 0, len = this.matches.length; i < len; i++) {
    match  = this.matches[i];
    done   = replacer.bind(match);
    result = this.tags[match.tag](match.options, done);

    if (result !== undefined) {
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

Shortcode.prototype.escapeTag = function (str) {
  return str.replace(/"/g, '&quot;');
};

Shortcode.prototype.escapeRegExp = function (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
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
