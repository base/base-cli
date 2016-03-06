'use strict';

var utils = require('./utils');

module.exports = function(app, key, val) {
  var opts = {};
  opts[key] = val;

  /**
   * Save to (cross-application) global defaults
   */

  if (app.argv.has('global') && app.globals) {
    utils.timestamp('updated global defaults with: %s', utils.formatValue(opts));
    app.globals.set(key, val);
  }

  /**
   * Save to the current "app" store
   */

  if ((app.argv.has('store') || app.argv.has('save')) && app.store) {
    utils.timestamp('updated config store with: %s', utils.formatValue(opts));
    app.store.set(key, val);
  }
};

