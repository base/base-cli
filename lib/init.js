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

  options = utils.extend({}, options, app.options);
  app.use(askSeries(options));

  app.questions.disable('save')
    .set('global.preferences', 'Would you like to use global preferences?', {
      type: 'confirm',
      next: function(key, answers, next) {
        debug('global preferences');

        var tableized = utils.tableize(answers);
        var answer = tableized[key];

        if (answer === true && app.store.has('preferences')) {
          debug('using global preferences');

          var opts = utils.extend({}, options, {
            answers: answers,
            config: app.store.get('preferences')
          });

          // when `--init` is passed, `force` is set to true by default
          // but when `--config=init` is passed, you also need to pass
          // `--force` to re-ask questions
          if (opts.force === true) {
            app.askSeries('config', opts, next);
          } else {
            next(null, key, {config: app.store.get('preferences')});
          }

        } else {
          debug('asking config questions');
          var opts = utils.extend({}, options, {answers: answers});
          app.askSeries('config', opts, next);
        }
      }
    })
    .set('config.layout', 'What layout would you like to use?', {
      default: 'default'
    })
    .set('config.toc', 'Do you want to add a Table of Contents to README.md?', {
      type: 'confirm',
      default: 'N'
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
    .set('after.plugins', 'Plugins must be listed in devDependencies, do you want install them now?', {
      type: 'confirm'
    });

  app.askSeries('global.preferences', function(err, key, answers) {
    if (err) return cb(err);

    debug('finished with global.preferences "%j"', answers);
    var answer = utils.get(answers, 'global.preferences');
    if (answer === true) {
      app.store.set('preferences', answers[key]);
    }

    var plugins = arrayify(app, utils.get(answers, 'config.plugins'));
    if (plugins.length) {
      app.ask('after', function(err, res) {
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

function askSeries(config) {
  return function(app) {

    this.define('askSeries', function(key, options, cb) {
      if (typeof options === 'function') {
        cb = options;
        options = {};
      }

      var opts = utils.extend({}, config, app.options, options);

      debug('askSeries: %s', key);
      var question = app.questions.get(key);
      if (!question) {
        cb(null, key, opts);
        return;
      }

      app.ask(key, opts, function(err, answers) {
        if (err) return cb(err);

        answers = utils.extend({}, opts.answers, answers);
        if (Array.isArray(question)) {
          cb.call(this, null, key, answers);
          return;
        }

        var next = question.options.next;
        var answer = answers[key];
        if (typeof next === 'function') {
          next.call(question, key, answers, cb);
          return;
        }

        if (utils.isAffirmative(answer) && typeof next === 'string') {
          app.askSeries(next, options, cb);
          return;
        }

        if (app.questions.has(answer)) {
          app.askSeries(answer, options, cb);
          return;
        }

        cb.call(this, null, key, answers);
      }.bind(this));
    });
  };
}

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