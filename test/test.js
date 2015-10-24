'use strict';

require('mocha');
var assert = require('assert');
var minimist = require('minimist');
var store = require('base-store');
var base = require('base-methods');
var data = require('base-data');
var option = require('base-options');
var expandArgs = require('expand-args');
var cli = require('..');
var app;

function expand(argv) {
  return expandArgs(minimist(argv));
}

describe('cli', function () {
  beforeEach(function() {
    app = base();
    app.use(store('base-cli-tests'));
    app.use(cli());
  });

  describe('methods', function () {
    it('should expose a "cli" object on app:', function () {
      assert(app.cli);
      assert(typeof app.cli === 'object');
    });

    it('should expose a "process" method on app.cli:', function () {
      assert(typeof app.cli.process === 'function');
    });

    it('should expose a "map" method on app.cli:', function () {
      assert(typeof app.cli.map === 'function');
    });
  });

  describe('config mapping', function () {
    it('should expose the config object from app.cli', function () {
      assert(app.cli.config);
      assert(typeof app.cli.config === 'object');
    });

    it('should add a set method to config', function () {
      assert(typeof app.cli.config.set === 'function');
    });
    it('should add a get method to config', function () {
      assert(typeof app.cli.config.get === 'function');
    });
    it('should add a del method to config', function () {
      assert(typeof app.cli.config.del === 'function');
    });
  });

  describe('map', function() {
    beforeEach(function() {
      app = base();
      app.use(store('base-cli-tests'));
      app.use(cli());
    });

    it('should process an object of flags', function() {
      app.on('option', function(key, val) {
        assert(key);
        assert(key === 'a');
        assert(val === 'b');
        cb();
      });

      app.cli.process({option: {a: 'b'}});
    });

    it('should be chainable', function(cb) {
      app.cli.alias('a', 'b')
        .alias('b', 'c')
        .alias('c', 'set')
        .map('set')

      app.on('set', function(key, val) {
        assert(key);
        assert(key === 'a');
        assert(val === 'b');
        cb();
      });

      app.cli.process({c: {a: 'b'}});
    });

    it('should add properties to app.cli.config', function (cb) {
      app.cli.map('foo', 'set');
      app.cli.map('bar', 'get');
      var called = 0;

      app.on('set', function(key, val) {
        assert(key);
        assert(key === 'a');
        assert(val === 'b');
        called++;
      });

      app.on('get', function(key, val) {
        assert(key);
        assert(key === 'a');
        assert(val === 'b');
        called++;
      });

      app.cli.process({set: {a: 'b'}, get: 'a'});
      assert(called === 2);
      cb();
    });
  });

  describe('store.map', function() {
    beforeEach(function() {
      app = base();
      app.use(store('base-cli-tests'));
      app.use(cli());
    });

    it('should add properties to app.cli.config.store', function (cb) {
      app.store.cli.map('foo', 'set');
      app.store.cli.map('bar', 'get');
      var called = 0;

      app.store.on('set', function(key, val) {
        assert(key);
        assert(key === 'a');
        assert(val === 'b');
        called++;
      });

      app.store.on('get', function(key, val) {
        assert(key);
        assert(key === 'a');
        assert(val === 'b');
        called++;
      });

      app.store.cli.process({set: {a: 'b'}, get: 'a'});
      assert(called === 2);
      cb();
    });
  });

  describe('process', function() {
    it('should process an object of flags', function() {
      app.on('option', function(key, val) {
        assert(key);
        assert(key === 'a');
        assert(val === 'b');
        cb();
      });

      app.cli.process({option: {a: 'b'}});
    });
  });
});

describe('should handle methods added by other plugins', function () {
  beforeEach(function() {
    app = base();
    app.use(store('base-cli-tests'));
    app.use(option);
    app.use(data());
    app.use(cli());
  });

  afterEach(function() {
    app.store.del({force: true});
  });

  describe('store', function () {
    it('should add a store method to config', function () {
      assert(typeof app.cli.config.store === 'function');
    });
  });

  describe('option', function () {
    it('should add an option method to config', function () {
      assert(typeof app.cli.config.option === 'function');
    });
  });

  describe('data', function () {
    it('should add a data method to config', function () {
      assert(typeof app.cli.config.data === 'function');
    });
  });
});

describe('events', function () {
  beforeEach(function() {
    app = base();
    app.use(store('base-cli-tests'));
    app.use(option);
    app.use(data());
    app.use(cli());
  });

  afterEach(function() {
    app.store.del({force: true});
  });

  describe('set', function () {
    it('should emit a set event', function (cb) {
      var argv = expand(['--set=a:b']);

      app.on('set', function(key, val) {
        assert(key);
        assert(val);
        assert(app.a === 'b');
        assert(key === 'a');
        assert(val === 'b');
        cb();
      });

      app.cli.process(argv);
    });
  });

  describe('get', function () {
    it('should emit a get event', function (cb) {
      var argv = expand(['--get=a']);
      app.set('a', 'b');

      app.on('get', function(key, val) {
        assert(key);
        assert(val);
        assert(key === 'a');
        assert(val === 'b');
        cb();
      });

      app.cli.process(argv);
    });
  });

  describe('del', function () {
    it('should emit a del event', function (cb) {
      var argv = expand(['--del=a']);
      app.set('a', 'b');

      app.on('del', function(key) {
        assert(key);
        assert(key === 'a');
        assert(typeof app.a === 'undefined');
        cb();
      });

      app.cli.process(argv);
    });
  });

  describe('option', function () {
    it('should emit an option event', function (cb) {
      var argv = expand(['--option=a:b']);

      app.on('option', function(key, val) {
        assert(key);
        assert(key === 'a');
        assert(val === 'b');
        cb();
      });

      app.cli.process(argv);
    });
  });

  describe('data', function () {
    it('should emit a data event', function (cb) {
      var argv = expand(['--data=a:b']);

      app.on('data', function(args) {
        assert(Array.isArray(args));
        assert(args.length === 1);
        assert(args[0].a === 'b');
        cb();
      });

      app.cli.process(argv);
    });
  });

  describe('store', function () {
    it('should emit a store.set event', function (cb) {
      var argv = expand(['--store.set=a:b']);
      app.store.on('set', function(key, val) {
        assert(key);
        assert(val);
        assert(app.store.data.a === 'b');
        assert(key === 'a');
        assert(val === 'b');
        cb();
      });

      app.cli.process(argv);
    });

    it('should emit a store.get event', function (cb) {
      var argv = expand(['--store.get=a']);
      app.store.set('a', 'b');

      app.store.on('get', function(key, val) {
        assert(key);
        assert(val);
        assert(key === 'a');
        assert(val === 'b');
        cb();
      });

      app.cli.process(argv);
    });

    it('should emit a store.del event', function (cb) {
      var argv = expand(['--store.del=a,b']);
      app.store.set('a', 'aaa');
      app.store.set('b', 'bbb');
      var keys = [];

      app.store.on('del', function(key) {
        keys.push(key);
      });

      app.cli.process(argv);
      assert(keys.length === 2);
      process.nextTick(function () {
        assert(Object.keys(app.store.data).length === 2);
      });
      cb();
    });

    it('should delete the entire store', function (cb) {
      var argv = expand(['--store.del=force:true']);
      app.store.set('a', 'aaa');
      app.store.set('b', 'bbb');
      var keys = [];

      app.store.on('del', function(key) {
        keys.push(key);
      });

      app.cli.process(argv);
      assert(keys.length === 2);
      process.nextTick(function () {
        assert(Object.keys(app.store.data).length === 0);
      });
      cb();
    });
  });
});

describe('aliases', function () {
  beforeEach(function() {
    app = base();
    app.use(store('base-cli-tests'));
    app.use(option);
    app.use(data());
    app.use(cli());
  });

  afterEach(function() {
    app.store.del({force: true});
  });

  describe('show', function () {
    it('should emit a show event', function (cb) {
      var argv = expand(['--show=a']);
      app.set('a', 'b');

      app.on('get', function(key, val) {
        assert(key);
        assert(val);
        assert(key === 'a');
        assert(val === 'b');
        cb();
      });

      app.cli.process(argv);
    });
  });

  describe('store.show', function () {
    it('should emit a store.show event', function (cb) {
      var argv = expand(['--store.show=a']);
      app.store.set('a', 'b');

      app.store.on('get', function(key, val) {
        assert(key);
        assert(val);
        assert(key === 'a');
        assert(val === 'b');
        cb();
      });

      app.cli.process(argv);
    });
  });
});
