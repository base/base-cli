'use strict';

var padRight = require('pad-right');
var utils = require('../utils');
var bold = utils.colors.bold;
var cyan = utils.colors.cyan;
var gray = utils.colors.gray;

module.exports = function(app, base, options) {
  return function(val, key, config, next) {
    app.debug('command > %s: "%j"', key, val);
    console.log(format(help(app, base, options)));
    next();
  };
};

/**
 * Create `help` documentation
 */

function help(app, base, options) {
  var appname = base.option('appname');
  var name = base._name;

  return {
    heading: 'Usage: ' + cyan(name + ' <command> [options]')
      + '\n\nCommand: ' + upper(appname) + ' or tasks to run'
      + '\n\nExamples:'
      + gray('\n\n  # run the "foo" ' + appname + '')
      + bold('\n  $ ' + name + ' foo')
      + gray('\n\n  # run the "bar" task on ' + appname + ' "foo"')
      + bold('\n  $ ' + name + ' foo:bar')
      + gray('\n\n  # run multiple tasks on ' + appname + ' "foo"')
      + bold('\n  $ ' + name + ' foo:bar,baz,qux')
      + gray('\n\n  ' + upper(name) + ' attempts to automatically determine if "foo" is a task or ' + appname + '.'
      + '\n  If there is a conflict, you can force ' + name + ' to run ' + appname + ' "foo"'
      + '\n  by specifying a task on the ' + appname + '. Example: `' + name + ' foo:default`')
      + '\n\nOptions:',

    options: {
      ask: {
        hide: true,
        description: 'this command is not enabled yet',
        example: '',
        short: null
      },
      choose: {
        hide: true,
        description: 'this command is not enabled yet',
        example: '',
        short: null
      },
      config: {
        description: 'Save a configuration value to package.json',
        example: '--config=toc:false',
        short: 'c'
      },
      cwd: {
        description: 'Set or display the current working directory',
        example: '',
        short: null
      },
      data: {
        description: 'Define data. API equivalent of `app.data()`',
        example: '',
        short: 'd'
      },
      diff: {
        hide: true,
        description: 'this command is not enabled yet',
        example: '',
        short: null
      },
      disable: {
        description: 'Disable an option. API equivalent of "app.disable(\'foo\')"',
        example: '',
        short: null
      },
      enable: {
        description: 'Enable an option. API equivalent of "app.enable(\'foo\')"',
        example: '',
        short: null
      },
      global: {
        description: 'Save a global configuration value to use as a default',
        example: '--global=toc:false',
        short: 'g'
      },
      help: {
        description: 'Display this help menu',
        example: '',
        short: 'h'
      },
      init: {
        description: 'Prompts for configuration values and stores the answers',
        example: '',
        short: 'i'
      },
      open: {
        description: 'Open the `answers`, `store` or given directory',
        command: 'dir',
        example: '',
        short: null
      },
      option: {
        description: 'Define options. API equivalent of `app.option()`',
        example: '',
        short: 'o'
      },
      run: {
        description: 'Force tasks to run regardless of command line flags used',
        example: '',
        short: null
      },
      show: {
        description: 'Display the value of <key>',
        example: '--show <key>',
        command: 'key',
        short: null
      },
      tasks: {
        hide: true,
        description: 'this command is not enabled yet',
        example: '',
        short: null
      },
      version: {
        description: 'Get the current version of ' + name,
        example: '',
        short: 'V'
      },
      verbose: {
        description: 'Display all verbose logging messages',
        example: '',
        short: 'v'
      }
    },
    footer: ''
  };
}

function format(help) {
  var heading = help.heading || '';
  var options = help.options || {};
  var footer = help.footer || '';
  var optsList = '';

  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      var val = options[key];
      if (val.hide === true) continue;
      if (val.command) {
        key += ' <' + val.command + '>';
      }

      optsList += toFlag(key, val.short);
      optsList += val.description + '\n';
    }
  }

  var res = '\n' + heading + '\n\n';
  res += optsList + '\n';
  res += footer;
  return res;
}

function upper(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toFlag(key, short, max) {
  var str = shortKey(short) + '--' + key;
  return padRight(str, 20, ' ');
}

function shortKey(sh) {
  return sh ? ('-' + sh + ', ') : '    ';
}
