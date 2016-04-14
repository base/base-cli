'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var base = require('base');
var store = require('base-store');
var option = require('base-option');
var plugins = require('base-plugins');
var expandArgs = require('expand-args');
var minimist = require('minimist');
var cli = require('..');
var app;

function expand(argv, opts) {
  return expandArgs(minimist(argv, opts), opts);
}

describe('--use', function() {
  beforeEach(function(cb) {
    app = base();
    app.cwd = app.cwd || process.cwd();
    app.use(plugins());
    app.use(option());
    app.use(store('base-cli-tests'));
    app.use(cli());
    app.cli.map('use', function(val, key, config, next) {
      if (typeof val === 'string') {
        val = val.split(',');
      }

      if (Array.isArray(val)) {
        val.forEach(function(ele) {
          var fp = path.resolve(config.cwd || app.cwd, ele);
          var fn = require(fp);
          app.use(fn);
        });
      }
      next();
    });
    cb();
  });

  it('should use a plugin', function(cb) {
    var count = 0;
    app.once('use', function() {
      count++
    });

    app.cli.process({use: 'test/fixtures/plugins/a'}, function(err) {
      if (err) return cb(err);
      assert.equal(count, 1);
      cb();
    });
  });

  it('should use a plugin from a cwd', function(cb) {
    var count = 0;
    app.once('use', function(key, val) {
      count++;
    });

    app.cli.process({
      cwd: 'test/fixtures/plugins',
      use: 'a'
    }, function(err) {
      if (err) return cb(err);
      assert.equal(count, 1);
      cb();
    });
  });

  it('should use an array of plugins from a cwd', function(cb) {
    var n = 0;
    app.on('use', function() {
      n++;
    });

    app.cli.process({
      cwd: 'test/fixtures/plugins',
      use: 'a,b,c'
    }, function(err) {
      if (err) return cb(err);
      assert.equal(n, 3);
      cb();
    });
  });
});
