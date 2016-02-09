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

describe('cli commands', function() {
  beforeEach(function() {
    app = base();
    app.use(plugins());
    app.use(cli());
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
