/*!
 * base-cli <https://github.com/jonschlinkert/base-cli>
 *
 * Copyright (c) 2015-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./lib/utils');

module.exports = function(argv) {
  if (Array.isArray(argv)) {
    throw new TypeError('expected argv to be parsed');
  }

  return function(app, base) {
    if (!utils.isObject(app.get('pkg.data'))) {
      throw new Error('expected base-pkg to be registered');
    }
    this.use(utils.argv());
    this.use(utils.config.create('cli'));
  };
};
