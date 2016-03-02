'use strict';

require('mocha');
var assert = require('assert');
var minimist = require('minimist');
var base = require('base');
var store = require('base-store');
var data = require('base-data');
var plugins = require('base-plugins');
var options = require('base-option');
var expandArgs = require('expand-args');
var cli = require('..');
var app;

function expand(argv, opts) {
  return expandArgs(minimist(argv, opts), opts);
}

describe('cli', function() {
  beforeEach(function() {
    app = base();
    app.use(plugins());
    app.use(store('base-cli-tests'));
    app.use(cli());
  });

  describe('methods', function() {
    it('should expose a "cli" function on app:', function() {
      assert(app.cli);
      assert.equal(typeof app.cli, 'function');
    });

    it('should expose a "process" method on app.cli:', function() {
      assert.equal(typeof app.cli.process, 'function');
    });

    it('should expose a "map" method on app.cli:', function() {
      assert.equal(typeof app.cli.map, 'function');
    });
  });

  describe('config mapping', function() {
    it('should expose the config object from app.cli', function() {
      assert(app.cli.config);
      assert.equal(typeof app.cli.config, 'object');
    });

    it('should add a set method to config', function() {
      assert.equal(typeof app.cli.config.set, 'function');
    });
    it('should add a get method to config', function() {
      assert.equal(typeof app.cli.config.get, 'function');
    });
    it('should add a del method to config', function() {
      assert.equal(typeof app.cli.config.del, 'function');
    });
  });

  describe('cwd', function() {
    beforeEach(function() {
      app = base();
      app.use(plugins());
      app.use(store('base-cli-tests'));
      app.use(cli());
    });

    it('should set a cwd on app.options', function(cb) {
      app.on('option', function(key, val) {
        assert.equal(key, 'cwd');
        assert.equal(val, process.cwd());
        cb();
      });

      app.cli.process({cwd: process.cwd()}, function(err) {
        if (err) return cb(err);
      });
    });
  });

  describe('map', function() {
    beforeEach(function() {
      app = base();
      app.use(plugins());
      app.use(options());
      app.use(store('base-cli-tests'));
      app.use(cli());
    });

    it('should process an object of flags', function(cb) {
      app.on('option', function(key, val) {
        assert(key);
        assert.equal(key, 'a');
        assert.equal(val, 'b');
        cb();
      });

      app.cli.process({option: {a: 'b'}}, function(err) {
        if (err) return cb(err);
      });
    });

    it('should be chainable', function(cb) {
      app.cli.alias('a', 'b')
        .alias('b', 'c')
        .alias('c', 'set')
        .map('set')

      app.on('set', function(key, val) {
        assert(key);
        assert.equal(key, 'a');
        assert.equal(val, 'b');
        cb();
      });

      app.cli.process({c: {a: 'b'}}, function(err) {
        if (err) return cb(err);
      });
    });

    it('should add properties to app.cli.config', function(cb) {
      app.cli.map('foo', 'set');
      app.cli.map('bar', 'get');
      var called = 0;

      app.on('set', function(key, val) {
        assert(key);
        assert.equal(key, 'a');
        assert.equal(val, 'b');
        called++;
      });

      app.on('get', function(key, val) {
        assert(key);
        assert.equal(key, 'a');
        assert.equal(val, 'b');
        called++;
      });

      app.cli.process({set: {a: 'b'}, get: 'a'}, function(err) {
        if (err) return cb(err);

        assert.equal(called, 2);
        cb();
      });
    });
  });

  describe('process', function() {
    it('should process an object of flags', function(cb) {
      app.on('set', function(key, val) {
        assert(key);
        assert.equal(key, 'a');
        assert.equal(val, 'b');
        cb();
      });

      app.cli.process({set: {a: 'b'}}, function(err) {
        if (err) return cb(err);
      });
    });
  });
});

describe('should handle methods added by other plugins', function() {
  beforeEach(function() {
    app = base();
    app.use(plugins());
    app.use(options());
    app.use(store('base-cli-tests'));
    app.use(data());
    app.use(cli());
  });

  afterEach(function() {
    app.store.del({force: true});
  });

  describe('store', function() {
    it('should add a store method to config', function() {
      assert.equal(typeof app.cli.config.store, 'function');
    });
  });

  describe('option', function() {
    it('should add an option method to config', function() {
      assert.equal(typeof app.cli.config.option, 'function');
    });
  });

  describe('data', function() {
    it('should add a data method to config', function() {
      assert.equal(typeof app.cli.config.data, 'function');
    });
  });
});

describe('events', function() {
  beforeEach(function() {
    app = base();
    app.use(plugins());
    app.use(options());
    app.use(store('base-cli-tests'));
    app.use(data());
    app.use(cli());
  });

  afterEach(function() {
    app.store.del({force: true});
  });

  describe('set', function() {
    it('should emit a set event', function(cb) {
      var argv = expand(['--set=a:b']);

      app.on('set', function(key, val) {
        assert(key);
        assert(val);
        assert.equal(app.a, 'b');
        assert.equal(key, 'a');
        assert.equal(val, 'b');
        cb();
      });

      app.cli.process(argv, function(err) {
        if (err) return cb(err);
      });
    });
  });

  describe('del', function() {
    it('should emit a del event', function(cb) {
      var argv = expand(['--del=a']);
      app.set('a', 'b');

      app.on('del', function(key) {
        assert(key);
        assert.equal(key, 'a');
        assert.equal(typeof app.a, 'undefined');
        cb();
      });

      app.cli.process(argv, function(err) {
        if (err) return cb(err);
      });
    });
  });

  describe('option', function() {
    it('should emit an option event', function(cb) {
      var argv = expand(['--option=a:b']);

      app.on('option', function(key, val) {
        assert(key);
        assert.equal(key, 'a');
        assert.equal(val, 'b');
        cb();
      });

      app.cli.process(argv, function(err) {
        if (err) return cb(err);
      });
    });
  });

  describe('data', function() {
    it('should emit a data event', function(cb) {
      var argv = expand(['--data=a:b']);

      app.on('data', function(args) {
        assert(Array.isArray(args));
        assert.equal(args.length, 1);
        assert.equal(args[0].a, 'b');
        cb();
      });

      app.cli.process(argv, function(err) {
        if (err) return cb(err);
      });
    });
  });
});

describe('aliases', function() {
  beforeEach(function() {
    app = base();
    app.use(plugins());
    app.use(options());
    app.use(store('base-cli-tests'));
    app.use(data());
    app.use(cli());
  });

  afterEach(function() {
    app.store.del({force: true});
  });

  describe('options', function() {
    it('should emit an option event', function(cb) {
      var argv = expand(['--options=a:b']);

      app.on('option', function(key, val) {
        assert(key);
        assert(val);
        assert.equal(key, 'a');
        assert.equal(val, 'b');
        cb();
      });

      app.cli.process(argv, function(err) {
        if (err) return cb(err);
      });
    });
  });

  describe('option', function() {
    it('should emit an option event', function(cb) {
      var argv = expand(['--option=a:b']);

      app.on('option', function(key, val) {
        assert(key);
        assert(val);
        assert.equal(key, 'a');
        assert.equal(val, 'b');
        cb();
      });

      app.cli.process(argv, function(err) {
        if (err) return cb(err);
      });
    });
  });
});

describe('cli', function() {
  beforeEach(function() {
    app = base();
    app.use(plugins());
    app.use(options());
    app.use(store('base-cli-tests'));
    app.use(data());
    app.use(cli());
  });

  afterEach(function() {
    app.store.del({force: true});
  });

  it('should map an object to methods', function(cb) {
    var argv = expand(['--set=a:b']);
    app.cli({
      set: 'set'
    });

    app.on('set', function(key, val) {
      assert(key);
      assert(val);
      assert.equal(app.a, 'b');
      assert.equal(key, 'a');
      assert.equal(val, 'b');
      cb();
    });

    app.cli.process(argv, function(err) {
      if (err) return cb(err);
    });
  });

  it('should use custom functions', function(cb) {
    var argv = expand(['--foo=a:b']);
    app.cli({
      set: 'set',
      foo: function(key, val) {
        app.set(key, val);
      }
    });

    app.on('set', function(key, val) {
      assert(key);
      assert(val);
      assert.equal(app.a, 'b');
      assert.equal(key, 'a');
      assert.equal(val, 'b');
      cb();
    });

    app.cli.process(argv, function(err) {
      if (err) return cb(err);
    });
  });

  it('should use alias mappings', function(cb) {
    var argv = expand(['--foo=a:b']);
    app.cli({
      set: 'set',
      foo: 'set'
    });

    app.on('set', function(key, val) {
      assert(key);
      assert(val);
      assert.equal(app.a, 'b');
      assert.equal(key, 'a');
      assert.equal(val, 'b');
      cb();
    });

    app.cli.process(argv, function(err) {
      if (err) return cb(err);
    });
  });

  it('should expose cli.map', function(cb) {
    var argv = expand(['--set=a:b']);
    app.cli.map('set');

    app.on('set', function(key, val) {
      assert(key);
      assert(val);
      assert.equal(app.a, 'b');
      assert.equal(key, 'a');
      assert.equal(val, 'b');
      cb();
    });

    app.cli.process(argv, function(err) {
      if (err) return cb(err);
    });
  });

  it('should expose cli.alias', function(cb) {
    var argv = expand(['--set=a:b']);
    app.cli.alias('foo', 'set');

    app.on('set', function(key, val) {
      assert(key);
      assert(val);
      assert.equal(app.a, 'b');
      assert.equal(key, 'a');
      assert.equal(val, 'b');
      cb();
    });

    app.cli.process(argv, function(err) {
      if (err) return cb(err);
    });
  });

  it('should throw if args are invalid', function(cb) {
    try {
      app.cli([]);
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert(err.message);
      assert.equal(err.message, 'expected key to be a string or object');
      cb();
    }
  });
});
