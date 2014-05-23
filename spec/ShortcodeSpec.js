/* jshint strict: false, unused: false */
/* global Shortcode, describe, it, expect */

describe('Shortcode', function() {
  it('is a function', function() {
    var sc = new Shortcode();
    expect(sc instanceof Shortcode).toBe(true);
  });

  it('accepts an element whose contents will be replaced', function() {
    var body = document.querySelector('body');
    var sc = new Shortcode(body);
    expect(sc.el).toEqual(body);
  });

  it('accepts an object of tags', function() {
    var body = document.querySelector('body');
    var sc = new Shortcode(body, {
      hello: function() {
        return ['Hello', 'world'].join(' ');
      }
    });

    expect(Object.keys(sc.tags)).toEqual(['hello']);
  });

  it('matches defined tags', function() {
    var contents = '' +
    '<div>' +
      '[hello]' +
    '</div>';
    $(contents).appendTo('body');

    var body = document.querySelector('body');
    var sc = new Shortcode(body, {
      hello: function() {
        return ['Hello', 'world'].join(' ');
      }
    });

    expect(sc.matches).toEqual(['hello']);
  });

  it('converts tag options to object');
  it('replaces tag with matching object result');
  it('asynchronously replaces tag with matching object result');
});
