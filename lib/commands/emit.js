'use strict';

/**
 * Support `--emit` for debugging
 *
 * Example:
 *   $ --emit data
 *
 * @cli public
 */

module.exports = function(app) {
  return function(val, next) {
    if (val && typeof val === 'string') {
      app.on(val, console.error.bind(console));
    }
    next();
  };
};
