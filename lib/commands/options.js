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
  return function(val, next) {
    if (val === true) {
      console.log('%s package.json:');
      console.log('------------');
      console.log(util.inspect(app.options, null, 10));
      process.exit(0);
    }
    next();
  };
};
