'use strict';

module.exports = function(app) {
  return function(val, key, config, next) {
    app.debug('command > %s: "%j"', key, val);

    if (typeof app.option === 'function') {
      app.option('diff', val);
    } else {
      app.options.diff = val;
    }
    next();
  };
};
