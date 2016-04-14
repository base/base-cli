'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var base = require('base');
var option = require('base-option');
var store = require('base-store');
var plugins = require('base-plugins');
var expandArgs = require('expand-args');
var minimist = require('minimist');
var pkg = require('base-pkg');
var cli = require('..');
var app;

function expand(argv, opts) {
  return expandArgs(minimist(argv, opts), opts);
}

describe('--store', function() {
  describe('store.map', function() {
    beforeEach(function() {
      app = base();
      app.use(pkg());
      app.use(plugins());
      app.use(option());
      app.use(store('base-cli-tests'));
      app.use(cli());
    });

    it('should expose `store.cli', function() {
      assert(app.store.cli);
      assert.equal(typeof app.store.cli, 'function');
    });

    it('should not blow up if store plugin is not used', function() {
      var foo = base();
      foo.use(cli());
      assert.equal(typeof foo.store, 'undefined');
    });

    it('should add properties to app.store.cli.config', function(cb) {
      app.store.cli.map('set', function(val, key, config, next) {
        app.store.set(val);
        next();
      });
      app.store.cli.map('get', function(val, key, config, next) {
        app.store.get(val);
        next();
      });
      app.store.cli.alias('foo', 'set');
      app.store.cli.alias('bar', 'get');
      var called = 0;

      app.store.on('set', function(key, val) {
        assert(key);
        assert.equal(key, 'a');
        assert.equal(val, 'b');
        called++;
      });

      app.store.on('get', function(key, val) {
        assert(key);
        assert.equal(key, 'a');
        assert.equal(val, 'b');
        called++;
      });

      app.store.cli.process({foo: {a: 'b'}, bar: 'a'}, function(err) {
        if (err) return cb(err);
        
        assert.equal(called, 2);
        cb();
      });
    });

    it('should work as a function', function(cb) {
      app.store.cli.map('set', function(val, key, config, next) {
        app.store.set(val);
        next();
      });
      app.store.cli.map('get', function(val, key, config, next) {
        app.store.get(val);
        next();
      });
      
      app.store.cli({
        foo: 'set',
        bar: 'get'
      });

      var called = 0;

      app.store.on('set', function(key, val) {
        assert(key);
        assert.equal(key, 'a');
        assert.equal(val, 'b');
        called++;
      });

      app.store.on('get', function(key, val) {
        assert(key);
        assert.equal(key, 'a');
        assert.equal(val, 'b');
        called++;
      });

      app.store.cli.process({foo: {a: 'b'}, bar: 'a'}, function(err) {
        if (err) return cb(err);
        
        assert.equal(called, 2);
        cb();
      });
    });
  });
});
