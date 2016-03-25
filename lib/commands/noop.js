'use strict';

module.exports = function(app, base, options) {
  return function(val, key, config, next) {
    next();
  };
};
