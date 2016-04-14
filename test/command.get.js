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

describe('--get', function() {
  beforeEach(function() {
    app = base();
    app.use(plugins());
    app.use(cli());
  });

  describe('get', function() {
    it('should emit a get event', function(cb) {
      app.cli.map('get', function(val, key, config, next) {
        app.get(val);
        next();
      });

      var argv = expand(['--get=a']);
      app.set('a', 'b');
      var count = 0;

      app.on('get', function(key, val) {
        assert(key);
        assert(val);
        assert.equal(key, 'a');
        assert.equal(val, 'b');
        count++;
      });

      app.cli.process(argv, function(err) {
        if (err) return cb(err);
        assert.equal(count, 1);
        cb();
      });
    });

    it('should emit multiple get events', function(cb) {
      app.cli.map('set', function(val, key, config, next) {
        app.set(val);
        next();
      });
      app.cli.map('get', function(val, key, config, next) {
        if (Array.isArray(val)) {
          val.forEach(app.get.bind(app));
        } else {
          app.get(val);
        }
        next();
      });

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

      app.cli.process(argv, function(err) {
        if (err) return cb(err);
        assert.equal(keys.length, 3);
        cb();
      });
    });
  });
});
