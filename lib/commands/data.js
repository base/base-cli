'use strict';

module.exports = function(app) {
  return function(val) {
    if (typeof app.data === 'function') {
      app.data(val);
    } else {
      app.cache.data = utils.extend({}, app.cache.data, val);
    }
  };
};
