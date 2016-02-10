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
      console.log('%s config:', name);
      console.log('------------');
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

    var oldConfig = utils.get(pkg, name) || {};
    val = utils.extend({}, oldConfig, val);

    pkg[name] = normalize(this, val, oldConfig);
    this.set('cache.pkg', pkg);

    var pkgPath = path.resolve(cwd, 'package.json');
    utils.writeJson.sync(pkgPath, pkg);
    next();
  };
};
