/*!
 * base-cli <https://github.com/jonschlinkert/base-cli>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var utils = require('./utils');

module.exports = function(args) {
  return function(app) {
    var cli = utils.mapper(app)
      .alias('show', 'get')
      .alias('options', 'option')
      .map('option')
      .map('data')
      .map('store', store(app.store))
      .map('enable')
      .map('enabled')
      .map('disable')
      .map('disabled')
      .map('define')
      .map('set')
      .map('del')
      .map('cwd', function(fp) {
        app.set('cwd', fp);
      })
      .map('has', function(prop) {
        arrayify(prop).forEach(function (key) {
          app.has(key);
        });
      })
      .map('get', function(prop) {
        arrayify(prop).forEach(function (key) {
          app.get(key);
        });
      })
      .map('use', function(names) {
        arrayify(names).forEach(function (name) {
          var cwd = app.get('cwd') || process.cwd();
          app.use(tryRequire(name, cwd));
        });
      });

    app.define('cli', proxy(cli));

    app.cli.keys.forEach(function(name) {
      app.on(name, function(key, val) {
        app.emit('*', name, key, val);
      });
    });

    if (app.store) {
      app.store.cli.keys.forEach(function(name) {
        app.store.on(name, function(key, val) {
          app.emit('*', 'store.' + name, key, val);
        });
      });
    }

    app.cli.process = function (val) {
      args = arrayify(args);
      if (val) args = args.concat(val);
      args.forEach(function(arg) {
        cli.process(arg);
      });
    };
  };

  function store(app) {
    if (!app) return {};
    var cli = utils.mapper(app)
      .alias('show', 'get')
      .map('set')
      .map('del')
      .map('has')
      .map('hasOwn')
      .map('get');

    app.define('cli', proxy(cli));
    return function(argv) {
      cli.process(argv);
    };
  }
};

/**
 * Proxy to support `app.cli` as a function or object
 * with methods, allowing the user to do either of
 * the following:
 *
 * ```js
 * base.cli({foo: 'bar'});
 *
 * // or
 * base.cli.map('foo', 'bar');
 * ```
 */

function proxy(config) {
  function fn(key, val) {
    if (typeof val === 'string') {
      config.alias.apply(config, arguments);
      return config;
    }

    if (typeof key === 'string') {
      config.map.apply(config, arguments);
      return config;
    }

    if (!utils.isObject(key)) {
      throw new TypeError('expected key to be a string or object');
    }

    for (var prop in key) {
      fn(prop, key[prop]);
    }
    return config;
  }
  fn.__proto__ = config;
  return fn;
}

/**
 * Cast the given value to an array
 */

function arrayify(val) {
  if (typeof val === 'string') {
    return val.split(',');
  }
  return Array.isArray(val) ? val : [val];
}

/**
 * Try to require the given module
 * or file path.
 */

function tryRequire(name, cwd) {
  name = utils.resolve(name);
  var attempts = [name], fp;

  try {
    return require(name);
  } catch(err) {}

  try {
    fp = path.resolve(name);
    attempts.push(fp);
    return require(fp);
  } catch(err) {}

  try {
    fp = path.resolve(utils.resolve(cwd), name);
    attempts.push(fp);
    return require(fp);
  } catch(err) {}

  throw new Error('cannot find plugin at: \n' + format(attempts));
}

function format(arr) {
  var res = '';
  arr.forEach(function (ele) {
    res += ' ✖ \'' + ele + '\'' + '\n';
  });
  return res;
}
