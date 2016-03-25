'use strict';

var util = require('util');
var utils = require('../utils');

/**
 * Persist a value to the global config store by prefixing a command line option
 * with `--save` or `-s`.
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

module.exports = function(app, base, options) {
  return function(val, key, config, next) {
    app.debug('command > %s: "%j"', key, val);

    if (utils.show(val)) {
      var obj = app.store.data;
      console.log(utils.formatValue(obj));
      process.exit(0);
    }

    // if `true`, move on to allow other commands to call `save`
    if (val === true) {
      next();
      return;
    }

    if (typeof val === 'string') {
      var obj = {};
      obj[val] = true;
      val = obj;
    }

    if (!utils.isObject(val)) {
      next(new Error('--save expects an object, cannot set "%s"', val));
      return;
    }

    // set the value
    app.store.set(val);

    // show the new value in the console
    utils.timestamp('updated config store with: %s', utils.formatValue(val));
    next();
  };
};
