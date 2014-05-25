/* jshint strict: false, unused: false */

var Shortcode = function(el, tags) {
  this.el      = el;
  this.tags    = tags;
  this.matches = {};
  this.regex   = '\\[{tag}(.*?)?\\]';

  if (!this.tags && !this.el) { return; }

  this.matchTags();
  this.replaceMatches();
};

Shortcode.prototype.matchTags = function() {
  var html = this.el.outerHTML;

  for (var key in this.tags) {
    if (this.tags.hasOwnProperty(key)) {
      var regex = new RegExp(this.template(this.regex, {
        tag: key
      }));

      var match = html.match(regex);
      if (match) {
        this.matches[key] = {
          tag: key,
          options: match[1],
          regex: new RegExp(match[0])
        };
        this.matches[key].options = this.parseTagOptions(this.matches[key].options);
      }
    }
  }
};

Shortcode.prototype.replaceMatches = function() {
  var html = this.el.innerHTML,
      newHtml = '';

  for (var key in this.matches) {
    if (this.matches.hasOwnProperty(key)) {
      // var result = this.tags[key]();

      // newHtml = html
      //   .replace(this.matches[key], this.tags[key]());

      // console.log(regex, this.tags[key]());
    }
  }

  // this.el.innerHTML = newHtml;
};

Shortcode.prototype.parseTagOptions = function(queryOptions) {
  var collection = {}, set;
  if (!queryOptions) { return; }

  set = queryOptions
          .replace(/(\w+=)/g, '\n$1')
          .split('\n');
  set.shift();

  for (var i = 0; i < set.length; i++) {
    var kv = set[i].split('=');
    collection[kv[0]] = kv[1].replace(/\'|\"/g, '');
  }

  return collection;
};

Shortcode.prototype.template = function (s, d) {
  for (var p in d) {
    s = s.replace(new RegExp('{' + p + '}','g'), d[p]);
  }
  return s;
};
