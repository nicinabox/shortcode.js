/*
 * shortcode.js 1.1.0
 * by @nicinabox
 * License: MIT
 * Issues: https://github.com/nicinabox/shortcode.js/issues
 */

/* jshint strict: false, unused: false */

;(function(window) {
  var Shortcode, parseOptions, escapeTagRegExp, matchInstance, convertToFragment,
      parseCallbackResult, textChildren, createPlaceholder;

  Shortcode = function(el, tags) {
    if (!el) { return; }

    this.el      = el;
    this.tags    = tags || {};
    this.matches = [];
    this.nodes   = [];
    this.regex   = '\\[(\\w+)(.*?)?\\](?:([\\s\\S]*?)(\\[\/\\1\\]))*';

    if (this.el.jquery) {
      this.el = this.el[0];
    }

    this.matchTags();
    this.convertMatchesToNodes();
    this.replaceNodes();
  };

  Shortcode.prototype.matchTags = function() {
    var match, instances, instance,
        text, nodes = textChildren(this.el);

    for (var i = 0, len = nodes.length; i < len; i++) {
      text      = nodes[i].textContent.trim();
      instances = text.match(new RegExp(this.regex, 'g')) || [];

      for (var n = 0; n < instances.length; n++) {
        instance = matchInstance(instances[n], this.regex);

        if (this.tags[instance.name]) {
          this.matches.push(instance);
          this.nodes.push(nodes[i]);
        }
      }

    }
  };

  Shortcode.prototype.convertMatchesToNodes = function() {
    var html, replacer, fragment, node,
        container = document.createElement('div');

    replacer = function(match, p1, p2, p3, p4, offset, string) {
      if (p1) {
        return match;
      } else {
        return createPlaceholder(this).outerHTML;
      }
    };

    for (var i = 0, len = this.nodes.length; i < len; i++) {
      node = this.nodes[i];
      html = node.textContent;

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

  // Private methods
  createPlaceholder = function(match) {
    var node = document.createElement('span');
    node.setAttribute('data-sc-tag', match.tag);
    node.className = 'sc-node sc-node-' + match.name;
    return node;
  };

  textChildren = function(el) {
    var n, a=[], walk=document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    while(n = walk.nextNode()) {
      a.push(n);
    }
    return a;
  };

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

  matchInstance = function(tag, re) {
    var instance,
        match = tag.match(new RegExp(re));

    instance = {
      name: match[1],
      tag: match[0],
      regex: escapeTagRegExp(tag),
      options: parseOptions(match[2]),
      contents: match[4] ? '' : undefined // Check for end tag
    };

    if (match[3]) { // contents
      instance.contents = match[3].trim();
      instance.tag      = instance.tag.replace(instance.contents, '');
      instance.regex    = instance.regex.replace(instance.contents, '([\\s\\S]*?)');
    }

    return instance;
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
