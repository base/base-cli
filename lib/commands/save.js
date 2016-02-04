'use strict';

var utils = require('../utils');

module.exports = function(app) {
  return function(val) {
    if (typeof app.store === 'undefined') {
      console.log('Cannot save. Try adding the base-store plugin.');
      return;
    }
    app.store.set(val);
  };
};
