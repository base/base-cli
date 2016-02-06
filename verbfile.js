'use strict';

var through = require('through2');

module.exports = function(verb) {
  verb.extendWith('verb-generate-readme');

  verb.plugin('toFlag', function(options) {
    return through.obj(function(file, enc, next) {
      var str = file.contents.toString();
      str = str.replace(/^(#+ \[)\./gm, '$1--');
      file.contents = new Buffer(str);
      next(null, file);
    });
  });

  verb.task('default', ['readme']);
};
