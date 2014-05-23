/* jshint strict: false, unused: false */

var Shortcode = function(el, tags) {
  this.el      = el;
  this.tags    = tags;
  this.matches = [];
  this.regex   = '\\[{tag}(.*?)?\\]';

  if (!this.tags && !this.el) { return; }

  this.matchTags();
};

Shortcode.prototype.matchTags = function() {
  var html = this.el.outerHTML;

  for (var key in this.tags) {
    if (this.tags.hasOwnProperty(key)) {
      var regex = new RegExp(this.template(this.regex, {
        tag: key
      }), 'g');

      if (html.match(regex, key)) {
        this.matches.push(key);
      }
    }
  }
};

Shortcode.prototype.template = function (s, d) {
  for (var p in d) {
    s = s.replace(new RegExp('{' + p + '}','g'), d[p]);
  }
  return s;
};
