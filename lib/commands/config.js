'use strict';

var path = require('path');
var normalize = require('../update');
var utils = require('../utils');

module.exports = function(app) {
  return function(val, next) {
    if (!utils.isObject(val)) {
      console.error('config expects an object, cannot set "%s"', val);
      process.exit(1);
    }

    var name = this._name.toLowerCase();
    var cwd = this.cwd || process.cwd();

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
