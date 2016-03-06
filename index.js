/*!
 * base-cli <https://github.com/jonschlinkert/base-cli>
 *
 * Copyright (c) 2015-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./lib/utils');
var cli = require('./lib/cli');

module.exports = function(options) {
  options = options || {};

  return function(app) {
    this.use(utils.argv());
    this.use(utils.ask());
    this.use(utils.config.create('cli'));
    argv(this, process.argv.slice(2));
    cli(this, options.keys || []);
  };
};

function argv(app, args) {
  define(app, '_argv', function() {
    return app.argv(utils.minimist(args, {alias: utils.aliases}));
  });

  utils.define(app.argv, 'get', function(key) {
    return utils.get(app._argv, key);
  });

  utils.define(app.argv, 'has', function(key) {
    return typeof app.argv.get(key) !== 'undefined';
  });
}

function define(app, prop, val) {
  utils.define(app, prop, {
    set: function(v) {
      utils.define(app, prop, v);
    },
    get: function fn() {
      if (fn.val) return fn.val;
      fn.val = val();
      return fn.val;
    }
  });
}
