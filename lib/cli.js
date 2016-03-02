'use strict';

var debug = require('debug')('base:cli:commands');
var commands = require('./commands');

module.exports = function(app, keys) {
  debug(app._name + ':cli');

  for (var key in commands) {
    if (!~keys.indexOf(key) && commands.hasOwnProperty(key)) {
      debug('adding command > %s', key);
      app.cli.map(key, commands[key](app));
    }
  }
};
