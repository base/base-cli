'use strict';

var utils = require('../utils');
var util = require('util');

/**
 * Enable a configuration setting. This is the API-equivalent of
 * calling `app.enable('foo')`, or `app.option('foo', true)`.
 *
 * ```sh
 * $ --enable=foo
 * # sets {foo: true}
 * ```
 * @name enable
 * @api public
 * @cli public
 */

module.exports = function(app) {
  return function(val, key, config, next) {
    app.debug('command > %s: "%j"', key, val);

    if (typeof val !== 'string') {
      next();
      return;
    }

    if (typeof app.enable === 'function') {
      app.enable(val);

    } else if (utils.typeOf(val) === 'object') {
      app.options[val] = true;
      app.emit('option', val, true);
    }
    next();
  };
};
