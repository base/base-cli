'use strict';

require('mocha');
var assert = require('assert');
var minimist = require('minimist');
var store = require('data-store');
var base = require('base-methods');
var data = require('base-data');
var option = require('base-options');
var expandArgs = require('expand-args');
var cli = require('..');
var app;

function expand(argv) {
  return expandArgs(minimist(argv));
}

// app.on('option', function (val, key) {
//   console.log('option:', val, key);
// });

// app.store.on('set', function (val, key) {
//   console.log('set:', val, key);
// });
// app.store.on('get', function (val, key) {
//   console.log('get:', val, key);
// });
// app.store.on('del', function (key) {
//   console.log('deleted:', key);
// });

// app.on('get', console.log);
// app.on('has', console.log);
// app.cli.process(expand(argv));


describe('cli', function () {
  beforeEach(function() {
    app = base();
    app.use(cli());
  });

  describe('methods', function () {
    it('should add a "cli" object to app:', function () {
      assert(app.cli);
      assert(typeof app.cli === 'object');
    });

    it('should add a "process" method to app.cli:', function () {
      assert(typeof app.cli.process === 'function');
    });
  });

  describe('config mapping', function () {
    it('should have a config object on app.cli', function () {
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
});

describe('special methods', function () {
  beforeEach(function() {
    app = base();
    app.store = store('base-cli-test');
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
    app.store = store('base-cli-test');
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
    it('should ', function (cb) {
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

    it.skip('should emit a store.del event', function (cb) {
      app.store.on('del', function(key) {
        assert(key);
        cb();
      });

      app.cli.process(argv);
    });

    it.skip('should delete the store', function (cb) {
      var argv = expand(['--store.del=force:true']);
      app.store.once('del', function () {
        cb();
      });

      app.cli.process(argv);
    });
  });

  describe.skip('option', function () {
    it('should emit an option event', function (cb) {
      app.on('option', function(key) {
        assert(key);
        cb();
      });

      app.cli.process(argv);
    });
  });

  describe.skip('data', function () {
    it('should emit a data event', function (cb) {
      app.on('data', function(key) {
        assert(key);
        cb();
      });

      app.cli.process(argv);
    });
  });
});
