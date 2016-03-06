'use strict';

module.exports = function createArgs(app, configOpts, argv) {
  if (Array.isArray(argv)) {
    argv = utils.minimist(argv, { alias: utils.aliases });
  }

  return app.argv(argv, utils.extend({
    whitelist: utils.whitelist,
    first: ['init', 'ask', 'emit', 'global', 'save', 'config', 'file'],
    last: ['tasks'],
    esc: utils.fileKeys
  }, configOpts));
};
