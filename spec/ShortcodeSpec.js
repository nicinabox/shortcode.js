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
    var $contents = $(contents);

    var sc = new Shortcode($contents, {
      hello: function() {
        return ['Hello', 'world'].join(' ');
      }
    });

    expect(sc.matches).toEqual({
      hello: {
        tag: 'hello',
        options: undefined,
        regex: '[hello]'
      }
    });
  });

  it('converts tag options to object', function() {
    var contents = '' +
    '<div>' +
      '[hello text="Hello world"]' +
    '</div>';
    var $contents = $(contents)

    var sc = new Shortcode($contents, {
      hello: function(options) {
        return options.text;
      }
    });

    expect(sc.matches.hello.options).toEqual({
      text: 'Hello world'
    });
  });

  it('replaces tag with matching object result', function() {
    var contents = '' +
    '<div>' +
      '[hello text="Hello world"]' +
    '</div>';
    var $contents = $(contents);

    var sc = new Shortcode($contents, {
      hello: function(options) {
        return options.text;
      }
    });

    expect($contents.html()).toEqual('Hello world');
  });

  it('asynchronously replaces tag with matching object result', function(done) {
    var contents = '' +
    '<div>' +
      '[hello text="Hello world"]' +
    '</div>';
    var $contents = $(contents);

    var sc = new Shortcode($contents, {
      hello: function(options, done) {
        setTimeout(function() {
          done(options.text);
        }, 0);
      }
    });

    setTimeout(function() {
      expect($contents.html()).toEqual('Hello world');
      done();
    }, 1);
  });

  it('supports DOM manipulation before return', function() {
    var contents = '' +
    '<div>' +
      '[overview target="h2"]' +
      '<h2>One</h2>' +
      '<h2>Two</h2>' +
      '<h2>Three</h2>' +
    '</div>';
    var $contents = $(contents);
    var sc = new Shortcode($contents, {
      overview: function(options) {
        $contents.find(options.target).each(function(index, el) {
          var id = $(el).text().toLowerCase().replace(' ', '-')
          $(this).attr('id', id);
        });

        return '<div id="overview">Overview</div>';
      }
    });

    console.log($contents.html());
    expect($contents.find('h2').first().attr('id')).toEqual('one');

  });
});

describe('jQuery plugin', function() {
  it('initializes with jQuery', function() {
    var contents = '' +
      '<div>' +
        '[hello text="Hello world"]' +
      '</div>';
    var $contents = $(contents);

    $contents.shortcode({
      hello: function(options) {
        return options.text;
      }
    });

    expect($contents.data('shortcode') instanceof Shortcode).toBe(true);
    expect($contents.html()).toEqual('Hello world');
  });
});
