'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var base = require('base');
var pkg = require('base-pkg');
var option = require('base-option');
var plugins = require('base-plugins');
var expandArgs = require('expand-args');
var minimist = require('minimist');
var cli = require('..');
var app;

function expand(argv, opts) {
  return expandArgs(minimist(argv, opts), opts);
}

describe('cli commands', function() {
  beforeEach(function() {
    app = base();
    app.use(pkg());
    app.use(option());
    app.use(plugins());
    app.use(cli());

    app.cli.map('cwd', function(val, key, config, next) {
      val = config[key] = path.resolve(val);
      if (app.option) {
        app.option('cwd', val);
      } else {
        app.options.cwd = val;
      }
      app.cwd = val;
      next();
    });
  });

  describe('--cwd', function() {
    it('should update `app.cwd` with the given cwd', function(cb) {
      var args = expand(['--cwd=test/fixtures']);

      app.cli.process(args, function(err) {
        if (err) return cb(err);
        assert.equal(app.cwd, path.resolve(__dirname, 'fixtures'));
        cb();
      });
    });

    it('should set a cwd on app.options', function(cb) {
      var count = 0;
      
      app.on('option', function(key, val) {
        assert.equal(key, 'cwd');
        assert.equal(val, process.cwd());
        count++;
      });

      app.cli.process({cwd: process.cwd()}, function(err) {
        if (err) return cb(err);
        assert.equal(count, 1);
        cb();
      });
    });

    it('should update `app.options.cwd` with the given cwd', function(cb) {
      var args = expand(['--cwd=test/fixtures']);

      app.cli.process(args, function(err) {
        if (err) return cb(err);
        assert.equal(app.options.cwd, path.resolve(__dirname, 'fixtures'));
        cb();
      });
    });
  });
});
