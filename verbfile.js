'use strict';

var through = require('through2');
var utils = require('./lib/utils');

module.exports = function(app) {
  app.use(require('verb-readme-generator'));

  app.plugin('toFlag', function(options) {
    return through.obj(function(file, enc, next) {
      var str = file.contents.toString();
      str = str.replace(/^(#+ \[)\./gm, '$1--');
      console.log(utils.green(' ✔'), 'plugin toFlag: converted titles to flags');
      file.contents = new Buffer(str);
      next(null, file);
    });
  });

  app.options.pipeline = app.options.pipeline || [];
  app.options.pipeline.push('toFlag');

  app.task('default', ['readme']);
};
