'use strict';

module.exports = function(app) {
  return function(val, next) {
    if (app.options.verbose) {
      console.log('--config is not implemented yet.');
    }
    next();
  };
};
