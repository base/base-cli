/*!
 * base-cli <https://github.com/jonschlinkert/base-cli>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function(options) {
  var config = require('map-config');

  return function cli(app) {
    var cli = config(app)
      .alias('show', 'get')
      .map('store', store(app.store))
      .map('option')
      .map('data')
      .map('set')
      .map('del')
      .map('get')
      .map('has');

    app.define('cli', cli);
  };

  function store(app) {
    var cli = config(app)
      .alias('show', 'get')
      .map('set')
      .map('del')
      .map('has')
      .map('get');

    return function(argv) {
      cli.process(argv);
    };
  }
}
