'use strict';

var util = require('util');
var utils = require('../utils');

/**
 * Persist a value to the global config store by prefixing a command line option
 * with `--save`.
 *
 * ```sh
 * # save a boolean
 * $ --save=toc # saves `{ toc: true }` to global config
 * # save the cwd to use as a global default
 * $ --save=cwd:foo
 * # save the tasks to run by default
 * $ --save=tasks:readme
 * ```
 * @name save
 * @related open
 * @param {Object} app
 * @api public
 * @cli public
 */

module.exports = function(app) {
  return function(val, key, config, next) {
    app.debug('command > %s: "%j"', key, val);

    if (typeof app.globals === 'undefined') {
      next(new Error('the -g flag requires an "app.globals" store to be defined'));
      return;
    }

    if (typeof val === 'string') {
      var obj = {};
      obj[val] = true;
      val = obj;
    }

    if (utils.show(val)) {
      var obj = app.globals.data;
      console.log(utils.cyan(util.inspect(obj, null, 10)));
      process.exit(0);
    }

    if (!utils.isObject(val)) {
      next(new Error('-g expects an object, cannot set "%s"', val));
      return;
    }

    // set the value
    app.globals.set(val);

    // show the new value in the console
    var msg = utils.cyan(util.inspect(val, null, 10));
    utils.timestamp('updated config store with: %s', msg);
    next();
  };
};
