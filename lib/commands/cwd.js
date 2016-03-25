'use strict';

var path = require('path');
var utils = require('../utils');
var save = require('../save');

/**
 * Set the current working directory.
 *
 * ```sh
 * # set working directory to 'foo'
 * $ --cwd=foo
 * # display cwd
 * $ --cwd
 * ```
 * @name cwd
 * @api public
 * @cli public
 */

module.exports = function(app, base, options) {
  return function(val, key, config, next) {
    app.debug('command > %s: "%j"', key, val);
    if (utils.show(val)) {
      console.log('cwd: "%s"', app.cwd);
      process.exit(0);
    }

    val = app.cwd = path.resolve(val);

    if (typeof app.option === 'function') {
      app.option('cwd', val);
    } else {
      app.options.cwd = val;
      app.emit('option', 'cwd', val);
    }

    // save if requested by user
    save(app, key, val);
    next();
  };
};

module.exports.help = {
  description: 'Set or display the current working directory',
  example: '',
  short: null
};
