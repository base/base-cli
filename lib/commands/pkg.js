'use strict';

module.exports = function(app) {
  return function(val, next) {
    if (!app.pkg) {
      next();
      return;
    }

    if (val === true) {
      console.log(app.pkg.data);
    } else {
      Object.keys(val).forEach(function(key) {
        console.log(key + ':', app.get(['pkg.data', key]));
      });
    }
    next();
  };
};
