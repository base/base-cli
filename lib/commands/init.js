'use strict';

var init = require('../init');

/**
 * Ask initialization questions and persist answer data to the global
 * config store.
 *
 * ```sh
 * $ --init
 * ```
 * @name init
 * @api public
 * @cli public
 */

module.exports = function(app) {
  return function(val, key, config, next) {
    app.debug('command > %s: "%j"', key, val);

    init(app, {force: true}, function(err, answers) {
      if (err) return next(err);
      app.cli.process(answers, next);
    });
  };
};
