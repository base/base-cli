/*!
 * base-cli <https://github.com/jonschlinkert/base-cli>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function() {
  var config = require('map-config');

  return function(app) {
    var cli = config(app);
    cli.alias('show', 'get')
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
    if (!app) return {};
    var cli = config(app)
      .alias('show', 'get')
      .map('set')
      .map('del')
      .map('has')
      .map('get');

    app.define('cli', cli);
    return function(argv) {
      cli.process(argv);
    };
  }
};
