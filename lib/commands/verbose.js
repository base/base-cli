'use strict';

/**
 * Temporary
 */

module.exports = function(app) {
  return function(val, key, config, next) {
    app.debug('command > %s: "%j"', key, val);

    if (val === true) {
      var keys = app.cli.keys;
      var len = keys.length;
      while (len--) {
        app.on(keys[len], console.error.bind(console));
      }
    }
    next();
  };
};
