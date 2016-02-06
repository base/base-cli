'use strict';

module.exports = function(app) {
  return function(val, next) {
    if (app.options.verbose) {
      console.log('--configfile is not implemented yet.');
    }
    next();
  };
};
