'use strict';

var debug = require('debug')('base:cli:commands');
var commands = require('./commands');

module.exports = function(app, base, keys, options) {
  app.debug('initializing commands');

  for (var key in commands) {
    if (~keys.indexOf(key)) continue;

    if (commands.hasOwnProperty(key)) {
      app.debug('adding command > %s', key);
      app.cli.map(key, commands[key](app, base, options));
    }
  }
};
