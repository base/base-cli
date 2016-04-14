'use strict';

var util = require('util');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('base-argv', 'argv');
require('base-config', 'config');
require('isobject', 'isObject');

/**
 * Expose `utils`
 */

module.exports = utils;
