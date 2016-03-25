'use strict';

var utils = require('../utils');

module.exports = function(app, base, options) {
  return function(val, key, config, next) {
    app.debug('command > %s: "%j"', key, val);

    if (utils.show(val)) {
      console.log('%s package.json:');
      console.log('------------');
      console.log(utils.formatValue(app.pkg.data));
      process.exit(0);
    }
    next();
  };
};
