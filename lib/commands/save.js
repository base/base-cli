'use strict';

module.exports = function(app) {
  return function(val, next) {
    if (typeof app.store === 'undefined') {
      next();
      return;
    }
    app.store.set(val);
    next();
  };
};
