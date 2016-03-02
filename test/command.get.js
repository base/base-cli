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

describe.skip('--get', function() {
  beforeEach(function() {
    app = base();
    app.use(plugins());
    app.use(cli());
  });

  describe('get', function() {
    it('should emit a get event', function(cb) {
      var argv = expand(['--get=a']);
      app.set('a', 'b');

      app.on('get', function(key, val) {
        assert(key);
        assert(val);
        assert.equal(key, 'a');
        assert.equal(val, 'b');
        cb();
      });

      app.config.process(argv, function(err) {
        if (err) return cb(err);
      });
    });

    it('should emit multiple get events', function(cb) {
      var argv = expand(['--get=a,b,c']);
      app.set('a', 'aaa');
      app.set('b', 'bbb');
      app.set('c', 'ccc');
      var keys = [];

      app.on('get', function(key, val) {
        if (key === 'a') assert.equal(val, 'aaa');
        if (key === 'b') assert.equal(val, 'bbb');
        if (key === 'c') assert.equal(val, 'ccc');
        keys.push(key);
      });

      app.config.process(argv, function(err) {
        if (err) return cb(err);
        assert.equal(keys.length, 3);
        cb();
      });
    });
  });
});
