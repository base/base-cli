'use strict';

var through = require('through2');
var green = require('ansi-green');

module.exports = function(app, base) {
  app.extendWith('verb-readme-generator');

  app.plugin('toFlag', function(options) {
    return through.obj(function(file, enc, next) {
      var str = file.contents.toString();
      str = str.replace(/^(#+ \[)\./gm, '$1--');
      console.log(green(' ✔'), 'plugin toFlag: converted titles to flags');
      file.contents = new Buffer(str);
      next(null, file);
    });
  });

  app.task('default', ['readme']);
};

/**
 * Function to be called before the generator is invoked.
 * Experimental! not implemented yet!
 */

module.exports.setup = function(Base, base, ctx) {
  Base.on('runner', function(event, ctx) {
    console.log(event, ctx);
  });
  base.on('generator', function(name) {
    console.log(name);
  });
  base.files('foo', {content: 'whatever'});
};
