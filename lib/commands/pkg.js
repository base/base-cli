'use strict';

var utils = require('../utils');
var util = require('util');

module.exports = function(app) {
  return function(val, key, config, next) {
    app.debug('command > %s: "%j"', key, val);

    if (utils.show(val)) {
      console.log('%s package.json:');
      console.log('------------');
      console.log(util.inspect(app.pkg.data, null, 10));
      process.exit(0);
    }
    next();
  };
};
