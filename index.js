/*!
 * base-cli <https://github.com/jonschlinkert/base-cli>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var config = require('map-config');

module.exports = function(args) {
  return function(app) {
    var cli = config(app)
      .alias('show', 'get')
      .alias('options', 'option')
      .map('store', store(app.store))
      .map('data')
      .map('option')
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
          app.get(key);
        });
      })
      .map('get', function(prop) {
        arrayify(prop).forEach(function (key) {
          app.get(key);
        });
      })
      .map('use', function(names) {
        arrayify(names).forEach(function (name) {
          app.use(tryRequire(name, app));
        });
      });

    app.define('cli', proxy(cli));

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
    var cli = config(app)
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

    if (!isObject(key)) {
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

function arrayify(val) {
  if (typeof val === 'string') {
    return val.split(',');
  }
  return Array.isArray(val) ? val : [val];
}

function tryRequire(name, app) {
  try {
    return require(name);
  } catch(err) {}

  try {
    var cwd = app.get('cwd') || process.cwd();
    return require(path.resolve(cwd, name));
  } catch(err) {}

  return function() {
    console.log('cannot find plugin:', name);
  };
}
