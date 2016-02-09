'use strict';

var utils = require('../utils');

module.exports = function(existing, app) {
  if (!utils.isObject(existing)) {
    existing = utils.arrayify(existing);
  }

  return {
    type: ['array'],
    normalize: function(val, key, config, schema) {
      if (!utils.isObject(val)) {
        val = utils.arrayify(val);
      }

      if (Array.isArray(val)) {
        val = utils.union([], existing, utils.arrayify(val));
        if (val.length) {
          return val;
        }
      }
      return null;
    }
  };
};
