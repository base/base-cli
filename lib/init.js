'use strict';

var commands = require('spawn-commands');
var debug = require('debug')('base:cli:init');
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

  function group(prefix) {
    app.questions.add = function(name, msg, question) {
      app.questions.set(prefix + '.' + name, msg, question);
      return app.questions;
    }
  }

  app.questions.disable('save')
    .set('global.preferences', 'Would you like to use global preferences?', {
      type: 'confirm',
      next: function(answer, question, answers, cb) {
        if (answer === true) {
          app.ask('config', cb);
        } else {
          cb(null, answers);
        }
      }
    })
    .set('config.layout', 'What layout would you like to use?', {
      default: 'default'
    })
    .set('config.toc', 'Do you want to add a Table of Contents to README.md?', {
      type: 'confirm',
      default: false
    })
    .set('config.plugins', 'What plugins do you want to use?', {
      default: ['gulp-format-md']
    })
    .set('config.tasks', 'What tasks or generators do you want to run on this project?', {
      default: ['readme']
    })
    .set('config.run', 'Do you want to run tasks anyway when only non-task flags are passed?', {
      type: 'confirm'
    })
    .set('config.lint.reflinks', 'Do you want to lint for missing reflinks and add them to verb config?', {
      type: 'confirm'
    })
    .set('after.plugins', 'Plugins need to be installed, want to do that now?', {
      type: 'confirm'
    });

  app.ask('global.preferences', function(err, answers) {
    if (err) return cb(err);

    debug('finished with global.preferences "%j"', answers);

    var answer = utils.get(answers, 'global.preferences');
    if (answer === true) {
      app.questions.globals.set('preferences', answers.config);
    }

    var plugins = arrayify(app, utils.get(answers, 'config.plugins'));
    if (plugins.length) {
      app.ask('after', { force: true }, function(err, res) {
        if (err) return cb(err);

        var yes = utils.get(res, 'after.plugins');
        if (yes) {
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
