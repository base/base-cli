'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var base = require('base');
var plugins = require('base-plugins');
var expandArgs = require('expand-args');
var minimist = require('minimist');
var cli = require('..');
var app;

function expand(argv, opts) {
  return expandArgs(minimist(argv, opts), opts);
}

describe.skip('--use', function() {
  beforeEach(function() {
    app = base();
    app.use(plugins());
    app.use(cli());
  });

  describe('use', function() {
    beforeEach(function(cb) {
      app = base();
      app.use(plugins());
      app.use(options());
      app.use(store('base-cli-tests'));
      app.use(cli());
      cb()
    });

    it('should use a plugin', function(cb) {
      app.once('use', function() {
        cb();
      });

      app.cli.process({use: 'test/fixtures/plugins/a'}, function(err) {
        if (err) return cb(err);
      });
    });

    it('should use a plugin from a cwd', function(cb) {
      app.once('use', function(key, val) {
        cb();
      });

      app.cli.process({
        cwd: 'test/fixtures/plugins',
        use: 'a'
      }, function(err) {
        if (err) return cb(err);
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
});
