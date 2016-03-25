'use strict';

var through = require('through2');
var utils = require('./lib/utils');

module.exports = function(app) {
  app.extendWith('verb-readme-generator');

  app.plugin('toFlag', function(options) {
    return through.obj(function(file, enc, next) {
      var str = file.contents.toString();
      str = str.replace(/^(#+ \[)\./gm, '$1--');
      console.log(utils.green(' ✔'), 'plugin toFlag: converted titles to flags');
      file.contents = new Buffer(str);
      next(null, file);
    });
  });

  app.task('default', ['readme']);
};
