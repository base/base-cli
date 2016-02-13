'use strict';

var path = require('path');
var util = require('util');
var normalize = require('../update');
var utils = require('../utils');

module.exports = function(app) {
  return function(val, next) {
    var name = this._name.toLowerCase();
    var cwd = this.cwd || process.cwd();

    if (val === true) {
      var obj = app.pkg.get(name);
      console.log(util.inspect(obj, null, 10));
      process.exit(0);
    }

    if (!utils.isObject(val)) {
      next(new Error('config expects an object, cannot set "%s"', val));
      return;
    }

    var pkg = utils.pkg.sync(cwd);
    if (pkg === null) {
      next(new Error('cannot find package.json'));
      return;
    }


    // get package.json and update it
    var oldConfig = utils.get(pkg, name) || {};
    var merged = utils.extend({}, oldConfig, val);
    var newVal = normalize(this, merged, oldConfig);

    // show the new value in the console
    var msg = utils.cyan(util.inspect(pick(newVal, val), null, 10));
    utils.timestamp('updated package.json config with: %s', msg);

    pkg[name] = newVal;
    this.set('cache.pkg', pkg);

    var pkgPath = path.resolve(cwd, 'package.json');
    utils.writeJson.sync(pkgPath, pkg);
    next();
  };
};

function pick(pkg, obj) {
  var res = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      res[key] = pkg[key];
    }
  }
  return res;
}
