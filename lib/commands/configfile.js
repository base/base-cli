'use strict';

module.exports = function(app) {
  return function(val, next) {
    console.log('--configfile is not implemented yet.');
    next();
  };
};
