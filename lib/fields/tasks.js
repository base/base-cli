'use strict';

var utils = require('../utils');

module.exports = function(existing, app) {
  existing = utils.arrayify(existing);
  return {
    type: ['array'],
    normalize: function(val, key, config, schema) {
      if (!val) return;

      val = utils.union([], existing, utils.arrayify(val));
      if (val.length) {
        return val;
      }
      return null;
    }
  };
};
