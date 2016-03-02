'use strict';

var show = require('./show');

module.exports = function(app) {
  return show(app, true);
};
