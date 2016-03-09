'use strict';

var util = require('util');
var gutil = require('generator-util');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

utils.gutil = gutil;

// plugins
require('base-argv', 'argv');
require('base-config', 'config');
require('base-questions', 'ask');

// misc
require('empty-dir');
require('opn');
require('try-open');

// data/object utils
require('ansi-colors', 'colors');
require('arr-union', 'union');
require('define-property', 'define');
require('extend-shallow', 'extend');
require('fancy-log', 'timestamp');
require('get-value', 'get');
require('is-affirmative');
require('kind-of', 'typeOf');
require('map-schema', 'Schema');
require('minimist');
require('mixin-deep', 'merge');
require('question-match', 'match');
require('set-value', 'set');

// naming
require('namify');
require('load-pkg', 'pkg');
require('project-name', 'project');
require('write-json');
require = fn;

utils.cyan = utils.colors.cyan;
utils.green = utils.colors.green;
utils.magenta = utils.colors.magenta;
utils.tableize = gutil.tableize;
utils.homeRelative = gutil.homeRelative;

// logger noop
utils.white = function(msg) {
  return msg;
};

/**
 * Format a value to be displayed in the command line
 */

utils.formatValue = function(val) {
  var res = utils.cyan(util.inspect(val, null, 10));
  if (utils.isObject(val) && Object.keys(val).length > 1) {
    return '\n' + res;
  }
  return res;
};

/**
 * Save a value to, or delete a value from the specified stores.
 */

utils.stores = function(app, stores, val, method) {
  if (!Array.isArray(stores)) return;
  method = method || 'set';

  var len = stores.length;
  var idx = -1;

  if (utils.isObject(val)) {
    delete val.stores;
  }

  while (++idx < len) {
    var name = stores[idx];
    if (name === 'pkg') {
      app[name][method](app._name, val);
    } else {
      app[name][method](val);
    }
  }
};

/**
 * Returns true if `val` is true or is an object with `show: true`
 *
 * @param {String} `val`
 * @return {Boolean}
 * @api public
 */

utils.show = function(val) {
  return utils.isObject(val) && val.show === true;
};

/**
 * Return true if a filepath exists on the file system
 */

utils.exists = function(fp) {
  return fp && (typeof utils.tryOpen(fp, 'r') === 'number');
};

/**
 * Cast `val` to an array
 *
 * @param {String|Array} `val`
 * @return {Array}
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Return true if a value is an object.
 */

utils.isObject = function(val) {
  return utils.typeOf(val) === 'object';
};

/**
 * Return true if a directory exists and is empty.
 *
 * @param  {*} val
 * @return {Array}
 */

utils.isEmpty = function(dir) {
  return utils.emptyDir(dir, function(fp) {
    return !/\.DS_Store/i.test(fp);
  });
};

/**
 * File-related properties. Passed to [expand-args]
 * to ensure that no undesired escaping or processing
 * is done on filepath arguments.
 */

utils.fileKeys = [
  'base', 'basename', 'cwd', 'dir',
  'dirname', 'ext', 'extname', 'f',
  'file', 'filename', 'path', 'root',
  'stem'
];

/**
 * Whitelisted flags: these flags can be passed along with task
 * arguments. To run tasks with any flags, pass `--run`
 */

utils.whitelist = [
  'ask',
  'data',
  'emit',
  'force',
  'init',
  'layout',
  'option',
  'options',
  'readme',
  'set',
  'toc',
  'verbose'
].concat(utils.fileKeys);

/**
 * Aliases to pass to minimist. Defined here
 * so that it's available to any method.
 */

utils.aliases = {
  config: 'c',
  dirname: 'dir',
  extname: 'ext',
  file: 'f',
  filename: 'stem',
  global: 'g',
  save: 's',
  verbose: 'v',
  version: 'V'
};

/**
 * Expose `utils`
 */

module.exports = utils;
