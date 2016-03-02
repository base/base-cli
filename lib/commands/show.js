'use strict';

var utils = require('../utils');

module.exports = function(app, has) {
  return function(key, _, config, next) {
    app.debug('command > %s', key);

    if (utils.isObject(key)) {
      key = utils.tableize(key);
    }

    if (typeof key === 'string') {
      var name = this._name.toLowerCase();
      var val;

      if (key.indexOf('config') === 0) {
        key = key.replace('config', name);
        val = this.pkg.get(key);
        console.log(has ? !!val : val);
        next();
        return;
      }

      val = this.get(key)
        || this.get(['cache', key])
        || this.get(['cache.data', key])
        || this.get(['options', key]);

      if (val) {
        console.log(key, has ? !!val : val);
      } else if (has) {
        console.log(key, false);
      }
      next();
      return;
    }

    if (key === 'answers') {
      app.on('answers', console.log.bind(console));
      next();
      return;
    }

    if (key === 'commands') {
      console.log(key + '\n', app.commands.sort());
      next();
    }
  };
};
