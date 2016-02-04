'use strict';

module.exports = function(app) {
  return function(val, next) {
    if (typeof app.option === 'function') {
      app.option('cwd', val);
    } else {
      app.options.cwd = val;
      app.emit('option', 'cwd', val);
    }
    next();
  };
};
