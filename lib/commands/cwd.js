'use strict';

var path = require('path');

/**
 * Set the current working directory.
 *
 * ```sh
 * $ --cwd=foo
 * ```
 * @name cli
 * @api public
 * @cli public
 */

module.exports = function(app) {
  return function(val, next) {
    val = path.resolve(val);
    app.cwd = val;

    if (typeof app.option === 'function') {
      app.option('cwd', val);
    } else {
      app.options.cwd = val;
      app.emit('option', 'cwd', val);
    }
    next();
  };
};
