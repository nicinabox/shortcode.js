/* jshint strict: false, unused: false */
/* global Shortcode, jasmine, describe, it,
   expect, beforeEach, afterEach, loadFixtures */

jasmine.getFixtures().fixturesPath = 'javascripts/fixtures';

describe('Shortcode', function() {
  it('is a function', function() {
    var sc = new Shortcode();
    expect(sc instanceof Shortcode).toBe(true);
  });

  it('accepts an element whose contents will be replaced', function() {
    loadFixtures('basic.html');

    var basic = document.querySelector('#basic');
    var sc = new Shortcode(basic);
    expect(sc.el).toEqual(basic);
  });

  it('accepts an object of tags', function() {
    loadFixtures('basic.html');

    var basic = document.querySelector('#basic');
    var sc = new Shortcode(basic, {
      hello: function() {
        return ['Hello', 'world'].join(' ');
      }
    });

    expect(Object.keys(sc.tags)).toEqual(['hello']);
  });

  it('matches defined tags', function() {
    loadFixtures('basic.html');

    var sc = new Shortcode($('#basic'), {
      hello: function() {
        return ['Hello', 'world'].join(' ');
      }
    });

    expect(sc.matches).toEqual([{
      name: 'hello',
      tag: '[hello]',
      regex: '\\[hello\\]',
      options: undefined,
      contents: undefined
    }]);
  });

  it('converts tag options to object', function() {
    loadFixtures('overview.html');

    var sc = new Shortcode($('#overview'), {
      overview: function() {
        return this.options.target;
      }
    });

    expect(sc.matches[0].options).toEqual({
      target: 'h2'
    });
  });

  it('binds match object to this in tag method', function() {
    loadFixtures('overview.html');

    new Shortcode($('#overview'), {
      overview: function() {
        expect(this).toMatch({
          name: 'overview',
          tag: '[overview target="h2"]',
          options: { target : 'h2' },
          contents: undefined
        });
      }
    });
  });

  it('replaces tag with matching object result', function() {
    loadFixtures('basic_with_options.html');
    var $el = $('#basic_with_options');

    var sc = new Shortcode($el, {
      hello: function() {
        return this.options.text;
      }
    });

    expect($el.html()).toMatch('Hello world');
  });

  it('does not replace instances in code or pre', function() {
    loadFixtures('basic_with_pre.html');
    var $el = $('#basic_with_pre');

    var sc = new Shortcode($el, {
      hello: function() {
        return this.options.text;
      }
    });

    var html = '' +
      '\n'+
      '  <pre>[hello]</pre>\n' +
      '  <code>[hello text="Hello world"]</code>\n' +
      '\n' +
      '  Hello world\n';

    expect($el.html()).toEqual(html);
  });

  it('supports multiple instances', function() {
    loadFixtures('multiple.html');
    var $el = $('#multiple');

    var sc = new Shortcode($el, {
      hello: function() {
        if (this.options) {
          return this.options.text;
        } else {
          return '';
        }
      },
      overview: function() {
        return this.options.title;
      },
      tag: function() {
        return this.contents;
      }
    });

    var html = '\n' +
      '  \n' +
      '  \n' +
      '  123\n' +
      '  Contents\n' +
      '\n' +
      '  Test\n';

    expect($el.html()).toEqual(html);
  });

  it('supports start and end tags', function() {
    loadFixtures('start_and_end_tags.html');
    var $el = $('#start_and_end_tags');

    var sc = new Shortcode($el, {
      note: function() {
        expect(this).toEqual({
          name: 'note',
          tag: '[note text_color="" background_color="" border_color=""][/note]',
          regex: '\\[note text_color="" background_color="" border_color=""\\]([\\s\\S]*?)\\[\\/note\\]',
          contents: 'This is a note.',
          options: {
            'text_color': '',
            'background_color': '',
            'border_color': ''
          }
        });
      },
      lightbox: function() {
        expect(this).toEqual({
          name: 'lightbox',
          tag: '[lightbox title="test" link_type="button" button_text="" button_color="#1eb492" text_color="#ffffff"][/lightbox]',
          regex: '\\[lightbox title="test" link_type="button" button_text="" button_color="#1eb492" text_color="#ffffff"\\]\\[\\/lightbox\\]',
          contents: '',
          options: {
            'button_color': '#1eb492',
            'button_text': '',
            'link_type': 'button',
            'text_color': '#ffffff',
            'title': 'test'
          }
        });
      }
    });
  });

  it('asynchronously replaces tag with matching object result', function(done) {
    loadFixtures('basic_with_options.html');
    var $el = $('#basic_with_options');

    var sc = new Shortcode($el, {
      hello: function(complete) {
        var self = this;
        setTimeout(function() {
          complete(self.options.text);
        }, 0);
      }
    });

    setTimeout(function() {
      expect($.trim($el.html())).toEqual('Hello world');
      done();
    }, 1);
  });

  it('async returns string of html', function(done) {
    loadFixtures('basic_with_options.html');
    var $el = $('#basic_with_options');

    var sc = new Shortcode($el, {
      hello: function(complete) {
        var self = this;
        setTimeout(function() {
          complete('<button>Clicky</button><div>test</div>');
        }, 0);
      }
    });

    setTimeout(function() {
      expect($el.html().trim()).toEqual('<button>Clicky</button><div>test</div>');
      done();
    }, 1);
  });

  it('handles returned DOM element', function() {
    loadFixtures('overview.html');
    var $el = $('#overview');

    var sc = new Shortcode($el, {
      overview: function() {
        var overviewEl = document.createElement('div');
        overviewEl.id = 'overview';
        return overviewEl;
      }
    });

    expect($el[0].outerHTML).toMatch('<div id="overview"></div>');
  });

  it('handles returned jQuery element', function() {
    loadFixtures('overview.html');
    var $el = $('#overview');

    var sc = new Shortcode($el, {
      overview: function() {
        return $('<div>', { id: 'overview' });
      }
    });

    expect($el[0].outerHTML).toMatch('<div id="overview"></div>');
  });

  it('handles returned function', function() {
    loadFixtures('overview.html');
    var $el = $('#overview');

    var sc = new Shortcode($el, {
      overview: function() {
        return function() {
          return 'Contents';
        };
      }
    });

    expect($el[0].outerHTML).toMatch('Contents');
  });

  it('handles returned object', function() {
    loadFixtures('overview.html');
    var $el = $('#overview');

    var sc = new Shortcode($el, {
      overview: function() {
        return ['Contents'];
      }
    });

    expect($el[0].outerHTML).toMatch('[Contents]');
  });

  it('supports DOM manipulation before return', function() {
    loadFixtures('overview.html');
    var $el = $('#overview');

    var sc = new Shortcode($el, {
      overview: function() {
        $el.find(this.options.target).each(function(index, el) {
          var id = $(el).text().toLowerCase().replace(' ', '-');
          $(this).attr('id', id);
        });

        return '<div id="overview">Overview</div>';
      }
    });

    expect($el.find('h2').first().attr('id')).toEqual('one');
  });

  it('supports jQuery object as replacement', function() {
    loadFixtures('overview.html');
    var $el = $('#overview');

    var html = '<span>Overview</span>';
    var sc = new Shortcode($el, {
      overview: function(options) {
        return $(html);
      }
    });

    expect($el.html()).toMatch(html);

  });

  it('supports DOM object as replacement', function() {
    loadFixtures('overview.html');
    var $el = $('#overview');

    var html = '<span>Overview</span>';
    var sc = new Shortcode($el, {
      overview: function(options) {
        var el = document.createElement('span');
        el.innerHTML = 'Overview';
        return el;
      }
    });

    expect($el.html()).toMatch(html);
  });
});

describe('jQuery plugin', function() {
  it('initializes with jQuery', function() {
    loadFixtures('basic_with_options.html');
    var $el = $('#basic_with_options');

    $el.shortcode({
      hello: function(options) {
        return options.text;
      }
    });

    expect($el.data('shortcode') instanceof Shortcode).toBe(true);
    expect($el.html()).toMatch('Hello world');
  });
});
