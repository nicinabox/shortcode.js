/*
 * shortcode.js 1.1.0
 * by @nicinabox
 * License: MIT
 * Issues: https://github.com/nicinabox/shortcode.js/issues
 */

/* jshint strict: false, unused: false */

;(function(window) {
  var template, parseOptions, escapeTagRegExp, matchInstance, convertToFragment,
      parseCallbackResult;

  var Shortcode = function(el, tags) {
    if (!el) { return; }

    this.el      = el;
    this.tags    = tags;
    this.matches = [];
    this.nodes   = [];
    this.regex   = '\\[{name}(.*?)?\\](?:([\\s\\S]*?)(\\[\/{name}\\]))?';

    if (this.el.jquery) {
      this.el = this.el[0];
    }

    this.matchTags();
    this.convertMatchesToNodes();
    this.replaceNodes();
  };

  Shortcode.prototype.matchTags = function() {
    var match, instances, re, instance,
        text, nodes = this.textChildren();

    // Loop over each tag
    for (var key in this.tags) {
      if (!this.tags.hasOwnProperty(key)) { return; }
      re = template(this.regex, { name: key });

      // Compare tag to each node
      for (var i = 0, len = nodes.length; i < len; i++) {
        text      = nodes[i].textContent.trim();
        instances = text.match(new RegExp(re, 'g')) || [];

        if (instances.length) {
          this.nodes.push(nodes[i]);
        }

        // Match on each instance
        for (var j = 0, len2 = instances.length; j < len2; j++) {
          this.nodes.push(nodes[i]);
          instance = matchInstance(instances[j], re);

          this.matches.push({
            name: key,
            tag: instance.tag,
            regex: instance.regex,
            options: instance.options,
            contents: instance.contents
          });
        }
      }
    }
  };

  Shortcode.prototype.convertMatchesToNodes = function() {
    var html, replacer, fragment,
        container = document.createElement('div');

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

    for (var i = 0, len = this.nodes.length; i < len; i++) {
      var node = this.nodes[i];
      html     = node.textContent;

      var parentNode = node.parentNode;
      if (!parentNode) { return; }

      var parentNodeName = parentNode.tagName;

      if (!(/pre|code/i).test(parentNodeName)) {
        for (var k = 0, len2 = this.matches.length; k < len2; k++) {
          var match    = this.matches[k];
          var excludes = '(data-sc-tag=")?';
          var re       = new RegExp(excludes + match.regex, 'g');
          html         = html.replace(re, replacer.bind(match));
        }

        container.innerHTML = html;
        fragment = convertToFragment(container);
        parentNode.replaceChild(fragment, node);
      }
    }
  };

  Shortcode.prototype.replaceNodes = function() {
    var self = this, html, match, result, done, node, fn, replacer,
        nodes = document.querySelectorAll('.sc-node');

    replacer = function(result) {
      if (result.jquery) { result = result[0]; }

      result = parseCallbackResult(result);
      node.parentNode.replaceChild(result, node);
    };

    for (var i = 0, len = this.matches.length; i < len; i++) {
      match = this.matches[i];
      node  = document.querySelector('.sc-node-' + match.name);

      if (node && node.dataset.scTag === match.tag) {
        fn     = this.tags[match.name].bind(match);
        done   = replacer.bind(match);
        result = fn(done);

        if (result !== undefined) {
          done(result);
        }
      }
    }
  };

  Shortcode.prototype.textChildren = function(regex) {
    var n, a=[], walk=document.createTreeWalker(this.el, NodeFilter.SHOW_TEXT, null, false);
    while(n = walk.nextNode()) {
      if (regex && (regex).test(n)) {
        a.push(n);
      } else {
        a.push(n);
      }
    }
    return a;
  };

  // Private methods
  convertToFragment = function(el) {
    var fragment  = document.createDocumentFragment();
    var children = el.children;

    if (children.length) {
      for (var i = 0, len = children.length; i < len; i++) {
        fragment.appendChild(children[i].cloneNode(true));

        if (i !== len - 1) {
          fragment.appendChild(document.createTextNode('\n'));
        }
      }
    }

    return fragment;
  };

  matchInstance = function(instance, re) {
    var match, contents, tag, regex, options;

    match    = instance.match(new RegExp(re));
    contents = match[3] ? '' : undefined;
    tag      = match[0];
    regex    = escapeTagRegExp(tag);
    options  = parseOptions(match[1]);

    if (match[2]) {
      contents = match[2].trim();
      tag      = tag.replace(contents, '');
      regex    = regex.replace(contents, '([\\s\\S]*?)');
    }

    return {
      tag: tag,
      options: options,
      contents: contents,
      regex: regex
    };
  };

  parseCallbackResult = function(result) {
    var container, fragment, children;

    switch(typeof result) {
      case 'function':
        result = document.createTextNode(result());
        break;

      case 'string':
        container = document.createElement('div');
        container.innerHTML = result;
        fragment = convertToFragment(container);

        if (fragment.children.length) {
          result = fragment;
        } else {
          result = document.createTextNode(result);
        }
        break;

      case 'object':
        if (!result.nodeType) {
          result = JSON.stringify(result);
          result = document.createTextNode(result);
        }
        break;

      case 'default':
        break;
    }

    return result;
  };

  escapeTagRegExp = function(regex) {
    return regex.replace(/[\[\]\/]/g, '\\$&');
  };

  parseOptions = function(stringOptions) {
    var options = {}, set;
    if (!stringOptions) { return; }

    set = stringOptions
            .replace(/(\w+=)/g, '\n$1')
            .split('\n');
    set.shift();

    for (var i = 0; i < set.length; i++) {
      var kv = set[i].split('=');
      options[kv[0]] = kv[1].replace(/\'|\"/g, '').trim();
    }

    return options;
  };

  template = function(s, d) {
    for (var p in d) {
      s = s.replace(new RegExp('{' + p + '}','g'), d[p]);
    }
    return s;
  };

  // Polyfills
  String.prototype.trim = String.prototype.trim || function () {
    return this.replace(/^\s+|\s+$/g, '');
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

  // Make globally available
  window.Shortcode = Shortcode;
}(this));
