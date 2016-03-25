'use strict';

var debug = require('debug')('base:cli:init');
var commands = require('spawn-commands');
var questions = require('./questions');
var utils = require('./utils');

module.exports = function(app, options, cb) {
  if (typeof app.questions === 'undefined') {
    cb(new Error('expected base-questions plugin to be defined'));
    return;
  }

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  options = utils.merge({}, options, app.options);

  questions(app, options);
  app.questions.disable('save');

  app.ask('init.choose', function(err, answers) {
    if (err) return cb(err);

    debug('finished with init.choose "%j"', answers);

    var plugins = arrayify(app, utils.get(answers, 'config.plugins'));
    if (plugins.length) {
      app.ask('after', { force: true }, function(err, res) {
        if (err) return cb(err);

        var answer = utils.get(res, 'after.plugins');
        if (answer === true) {
          install(plugins, function(err) {
            if (err) return cb(err);
            cb(null, answers);
          });

        } else {
          cb(null, answers);
        }
      });
    } else {
      cb(null, answers);
    }
  });
};

function arrayify(app, val) {
  if (!val) return [];
  if (typeof val === 'string') {
    return val.split(',');
  }

  var deps = app.pkg.get('devDependencies') || {};
  var len = val.length;
  var idx = -1;
  var res = [];

  while (++idx < len) {
    var dep = val[idx];
    if (dep && !deps.hasOwnProperty(dep)) {
      res.push(dep);
    }
  }
  return res;
}

function install(names, cb) {
  commands({
    args: ['install', '-D', '--silent', names],
    cmd: 'npm'
  }, cb);
}
