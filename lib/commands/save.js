'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function(app) {
  return function(obj, next) {
    if (!utils.isObject(obj)) {
      cb(new Error('save expects an object, cannot set "%s"', obj));
      return;
    }

    var name = (this.base && this.base.name) || this.constructor.name.toLowerCase();
    var data = this.store.data;

    if (!utils.isObject(data)) {
      cb(new Error('the store command requires the base-store plugin to be registered'));
      return;
    }

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var val = normalize(key, obj[key]);
        var msg;

        if (Array.isArray(val)) {
          data[key] = data[key] || [];
          utils.union(data[key], val);
          msg = val.join(', ');

        } else if (utils.isObject(val)) {
          data[key] = utils.extend({}, data[key], val);
          msg = JSON.stringify(data[key]);

        } else {
          data[key] = val;
          msg = val;
        }
        console.log('global "%s" is now set to "%s"', key, msg);
      }
    }
    this.store.set(data);
    next();
  };
};

function normalize(key, val) {
  var arrayKeys = ['plugins', 'helpers', 'reflinks'];

  if (~arrayKeys.indexOf(key)) {
    if (typeof val === 'string') {
      return [val];
    }

    if (utils.isObject(val)) {
      for (var key in val) {
        if (val.hasOwnProperty(key)) {
          var value = val[key];
          if (typeof value === 'boolean') {
            return [key];
          }
        }
      }
    }
  }
  return val;
}
