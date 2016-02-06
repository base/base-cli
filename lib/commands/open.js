'use strict';

var path = require('path');
var utils = require('../utils');

/**
 * Open a directory, or open a file in the default application associated
 * with the file type.
 *
 * ```sh
 * # Open the directory where answer data is persisted
 * $ --open answers
 * # Open the directory where store data is persisted
 * $ --open store
 * ```
 * @name open
 * @api public
 * @cli public
 */

module.exports = function(app) {
  return function(dir, next) {
    if (dir === 'answers') {
      dir = app.get('questions.path');
      if (dir) {
        console.log('opening answers data directory: "%s"', dir);
        utils.opn(dir);
        return next();
      }
    }

    if (dir === 'store') {
      dir = path.dirname(app.get('store.path'));
      if (dir) {
        console.log('opening store data directory: "%s"', dir);
        utils.opn(dir);
        return next();
      }
    }

    if (!utils.exists(dir)) {
      console.log('filepath "%s" does not exist', dir);
      process.exit(1);
    }

    console.log('opening filepath: "%s"', dir);
    utils.opn(path.resolve(dir));
    next();
  };
};
