'use strict';

module.exports = function(app) {
  return function(val, key, config, next) {
    if (val === false) {
      delete config.tasks;
    }
    next();
  };
};
