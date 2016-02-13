'use strict';

var util = require('util');

/**
 * Show options in the command line.
 *
 * ```sh
 * $ app --options
 * ```
 * @name options
 * @api public
 * @cli public
 */

module.exports = function(app) {
  return require('./option')(app);
};
