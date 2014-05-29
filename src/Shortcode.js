/* jshint strict: false, unused: false */

var Shortcode = function(el, tags) {
  if (!el) { return; }

  this.el      = el;
  this.tags    = tags;
  this.matches = [];
  this.regex   = '\\[{name}(.*?)?\\]';

  if (this.el.jquery) {
    this.el = this.el[0];
  }

  this.matchTags();
  this.convertMatchesToNodes();
  this.replaceNodes();
};

Shortcode.prototype.matchTags = function() {
  var html = this.el.outerHTML, instances,
      match, re;

  for (var key in this.tags) {
    if (!this.tags.hasOwnProperty(key)) { return; }
    re        = this.template(this.regex, { name: key });
    instances = html.match(new RegExp(re, 'g')) || [];

    for (var i = 0, len = instances.length; i < len; i++) {
      match = instances[i].match(new RegExp(re));

      if (match) {
        this.matches.push({
          name: key,
          tag: match[0],
          options: this.parseOptions(match[1])
        });
      }
    }
  }
};

Shortcode.prototype.convertMatchesToNodes = function() {
  var html = this.el.innerHTML, self = this,
    replacer = function(match, p1, p2, p3, p4, offset, string) {
      if (p1) {
        return match;
      } else {
        var node = document.createElement('span');
        node.setAttribute('data-sc-tag', this.tag);
        node.className = 'sc-node sc-node-' + this.name;
        return node.outerHTML;
      }
    };

  for (var i = 0, len = this.matches.length; i < len; i++) {
    var excludes = '((data-sc-tag=")|(<pre.*)|(<code.*))?';
    var re = new RegExp(excludes + this.escapeRegExp(this.matches[i].tag), 'g');
    html = html.replace(re, replacer.bind(this.matches[i]));
  }

  this.el.innerHTML = html;
};

Shortcode.prototype.replaceNodes = function() {
  var self = this, html, match, result, done, node,
      nodes = document.querySelectorAll('.sc-node');

  var replacer = function(result) {
    if (result.jquery) { result = result[0]; }

    if (typeof result !== 'object') {
      result = document.createTextNode(result);
    }

    node.parentNode.replaceChild(result, node);
  };

  for (var i = 0, len = this.matches.length; i < len; i++) {
    match = this.matches[i];
    node  = document.querySelector('.sc-node-' + match.name);

    if (node && node.dataset.scTag === match.tag) {
      done   = replacer.bind(match);
      result = this.tags[match.name](match.options, done);

      if (result !== undefined) {
        done(result);
      }
    }
  }
};

Shortcode.prototype.parseOptions = function(stringOptions) {
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
