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

describe.skip('--has', function() {
  beforeEach(function() {
    app = base();
    app.use(plugins());
    app.use(cli());
  });

  describe('has', function() {
    it('should emit a has event', function(cb) {
      var argv = expand(['--has=a']);
      app.set('a', 'b');

      app.on('has', function(key, val) {
        assert.equal(key, 'a');
        assert.equal(val, true)
        cb();
      });

      app.cli.process(argv, function(err) {
        if (err) return cb(err);
      });
    });

    it('should emit multiple has events', function(cb) {
      var argv = expand(['--has=a,b,c']);
      app.set('a', 'aaa');
      app.set('b', 'bbb');
      app.set('c', 'ccc');
      var keys = [];

      app.on('has', function(key, val) {
        assert.equal(val, true);
        keys.push(key);
      });

      app.cli.process(argv, function(err) {
        if (err) return cb(err);
        assert.equal(keys.length, 3);
        cb();
      });
    });
  });
});
