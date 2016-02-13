'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var base = require('base');
var plugins = require('base-plugins');
var expandArgs = require('expand-args');
var minimist = require('minimist');
var writeJson = require('write-json');
var cli = require('..');
var app;

function expand(argv, opts) {
  return expandArgs(minimist(argv, opts), opts);
}

describe('--config', function() {
  beforeEach(function() {
    app = base();
    app.use(plugins());
    app.use(cli());
    app.cwd = path.join(__dirname, 'fixtures');
  });

  afterEach(function(cb) {
    var pkgPath = path.resolve(app.cwd, 'package.json');
    writeJson(pkgPath, {
      "name": "foo",
      "private": true
    }, cb);
  });

  describe('plugins', function() {
    it('should arrayify the plugins value when a boolean is passed', function(cb) {
      var args = expand(['--config=plugins:foo']);

      app.cli.process(args, function(err) {
        if (err) return cb(err);
        var pkg = app.get('cache.pkg');
        assert(pkg);
        assert(pkg.base);
        assert(Array.isArray(pkg.base.plugins));
        assert.equal(pkg.base.plugins[0], 'foo');
        cb();
      });
    });

    it('should arrayify the plugins value when a string array is passed', function(cb) {
      var args = expand(['--config=plugins:foo,bar,baz']);

      app.cli.process(args, function(err) {
        if (err) return cb(err);
        var pkg = app.get('cache.pkg');
        assert(pkg);
        assert(pkg.base);
        assert(Array.isArray(pkg.base.plugins));
        assert.equal(pkg.base.plugins[0], 'bar');
        assert.equal(pkg.base.plugins[1], 'baz');
        assert.equal(pkg.base.plugins[2], 'foo');
        cb();
      });
    });

    it('should arrayify the plugins value when a trailing comma is used', function(cb) {
      var args = expand(['--config=plugins:foo,']);

      app.cli.process(args, function(err) {
        if (err) return cb(err);
        var pkg = app.get('cache.pkg');
        assert(pkg);
        assert(pkg.base);
        assert(Array.isArray(pkg.base.plugins));
        assert.equal(pkg.base.plugins[0], 'foo');
        cb();
      });
    });
  });
});
