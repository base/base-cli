'use strict';

module.exports = function(app) {
  return function(val, next) {
    console.log('config', val);
    next();
  };
};
