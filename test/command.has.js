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

describe('--has', function() {
  beforeEach(function() {
    app = base();
    app.use(plugins());
    app.use(cli());
  });

  describe('has', function() {
    it('should emit a has event', function(cb) {
      app.cli.map('has', function(val, key, config, next) {
        app.has(val);
        next();
      });

      var count = 0;
      var argv = expand(['--has=a']);
      app.set('a', 'b');

      app.on('has', function(key, val) {
        assert.equal(key, 'a');
        assert.equal(val, true);
        count++;
      });

      app.cli.process(argv, function(err) {
        if (err) return cb(err);
        assert.equal(count, 1);
        cb();
      });
    });

  });
});
