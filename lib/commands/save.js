'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function(app) {
  return function(obj, next) {
    if (!utils.isObject(obj)) {
      cb(new Error('save expects an object, cannot set "%s"', obj));
      return;
    }

    var name = this._name.toLowerCase();
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
          data[key] = utils.union([], data[key], val);
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

    this.option(data);
    this.store.set(data);
    next();
  };
};

function normalize(prop, obj) {
  var arrayKeys = ['plugins', 'helpers', 'reflinks', 'tasks'];

  if (~arrayKeys.indexOf(prop)) {
    if (typeof obj === 'string') {
      return [obj];
    }

    if (utils.isObject(obj)) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          var val = obj[key];
          if (prop === 'tasks') {
            return key + ':' + val;
          }

          if (typeof val === 'boolean') {
            return [key];
          }
        }
      }
    }
  }
  return obj;
}
