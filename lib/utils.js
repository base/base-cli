'use strict';

var fs = require('fs');

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

// misc
require('opn');
require('try-open');

// data/object utils
require('extend-shallow', 'extend');
require('kind-of', 'typeOf');

// naming
require('namify');
require('project-name', 'project');
require = fn;

/**
 * Return true if a filepath exists on the file system
 */

utils.exists = function(fp) {
  return fp && (typeof utils.tryOpen(fp, 'r') === 'number');
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

utils.isEmpty = function(dir, fn) {
  var files;
  try {
    if (!utils.exists(dir)) {
      return false;
    }
    files = fs.readdirSync(dir);
    files = files.filter(fn || function(fp) {
      return !/\.DS_Store/i.test(fp);
    });
    return files.length === 0;
  } catch (err) {};
  return true;
};

/**
 * Expose `utils`
 */

module.exports = utils;
