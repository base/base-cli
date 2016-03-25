'use strict';

var utils = require('../utils');
var util = require('util');

/**
 * Disable a configuration setting. This is the API-equivalent of
 * calling `app.disable('foo')`, or `app.option('foo', false)`.
 *
 * ```sh
 * $ --disable=foo
 * # sets {foo: false}
 * ```
 * @name disable
 * @api public
 * @cli public
 */

module.exports = function(app, base, options) {
  return function(val, key, config, next) {
    app.debug('command > %s: "%j"', key, val);

    if (typeof val !== 'string') {
      next();
      return;
    }

    if (typeof app.disable === 'function') {
      app.disable(val);

    } else if (utils.typeOf(val) === 'object') {
      app.options[val] = true;
      app.emit('option', val, true);
    }

    // save if requested by user
    save(app, key, val);
    next();
  };
};
