'use strict';

module.exports = function(app) {
  return function(file, next) {
    var fp = app.configname;
    if (typeof file === 'string') {
      app.configname = file;
      if (file !== fp) {
        console.log('using ' + app.configfile + ' "%s"', file);
      }
    }
    next();
  };
};
