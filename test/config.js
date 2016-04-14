'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var base = require('base');
var pkg = require('base-pkg');
var plugins = require('base-plugins');
var expandArgs = require('expand-args');
var minimist = require('minimist');
var writeJson = require('write-json');
var cli = require('..');
var app;

var fixtures = path.resolve(__dirname, 'fixtures');

function expand(argv, opts) {
  return expandArgs(minimist(argv, opts), opts);
}

describe('--config', function() {
  beforeEach(function() {
    app = base();
    app.use(pkg());
    app.use(plugins());
    app.use(cli());
    app.cwd = fixtures;
    app.pkg.data = {};
  });

  afterEach(function(cb) {
    app.pkg.data = {};
    var pkgPath = path.resolve(fixtures, 'package.json');
    writeJson(pkgPath, {'name': 'foo', 'private': true}, cb);
  });

  describe('plugins', function() {
    it('should arrayify the plugins value when a boolean is passed', function(cb) {
      var args = expand(['--config=plugins:foo']);

      app.cli.process(args, function(err) {
        if (err) return cb(err);
        var data = app.pkg.data;
        assert(data);
        assert(data.base);
        assert(Array.isArray(data.base.plugins));
        assert.equal(data.base.plugins[0], 'foo');
        cb();
      });
    });

    it('should arrayify the plugins value when a string array is passed', function(cb) {
      var args = expand(['--config=plugins:foo,bar,baz']);

      app.cli.process(args, function(err) {
        if (err) return cb(err);
        var data = app.pkg.data;
        assert(data);
        assert(data.base);
        assert(Array.isArray(data.base.plugins));
        assert.equal(data.base.plugins[0], 'foo');
        assert.equal(data.base.plugins[1], 'bar');
        assert.equal(data.base.plugins[2], 'baz');
        cb();
      });
    });

    it('should arrayify the plugins value when a trailing comma is used', function(cb) {
      var args = expand(['--config=plugins:foo,']);

      app.cli.process(args, function(err) {
        if (err) return cb(err);
        var data = app.pkg.data;
        assert(data);
        assert(data.base);
        assert(Array.isArray(data.base.plugins));
        assert.equal(data.base.plugins[0], 'foo');
        cb();
      });
    });

    it('should filter out undefined values', function(cb) {
      var args = expand(['--config=plugins:,,,,']);

      app.cli.process(args, function(err) {
        if (err) return cb(err);
        var data = app.pkg.data;
        assert(data);
        assert(data.base);
        assert.equal(typeof data.base.plugins, 'undefined');
        cb();
      });
    });
  });
});
