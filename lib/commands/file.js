'use strict';

var utils = require('../utils');

module.exports = function(app) {
  return function(file, key, config, next) {
    app.debug('command > %s: "%j"', key, file);

    var fp = app.configfile;
    if (typeof file === 'string') {
      if (file !== fp) {
        app.configfile = file;
        utils.timestamp('using ' + app.configname + ' "%s"', file);
      }
    }
    next();
  };
};
