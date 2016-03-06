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
    this.use(utils.ask());
    this.use(utils.config.create('cli'));
    this.use(utils.argv());
    argv(this, process.argv.slice(2));
    cli(this, options.keys || []);
    update(this);
  };
};

function argv(app, args) {
  utils.define(app, '_argv', {
    configurable: true,
    enumerable: true,
    set: function(val) {
      utils.define(app, '_argv', val);
    },
    get: function() {
      return app.argv(utils.minimist(args, {alias: utils.aliases}));
    }
  });

  utils.define(app.argv, 'get', function(key) {
    return utils.get(app._argv, key);
  });

  utils.define(app.argv, 'has', function(key) {
    return typeof app.argv.get(key) !== 'undefined';
  });
}

function update(app) {
  var fn = app.cli.process;
  utils.define(app.cli, 'process', function(args, cb) {
    if (Array.isArray(args)) {
      args = utils.minimist(args, {alias: utils.aliases});
    }
    app._argv = args;
    fn.apply(app.cli, arguments);
  });
}
