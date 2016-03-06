'use strict';

var utils = require('../utils');

module.exports = function(app, has) {
  return function(prop, key, config, next) {
    app.debug('command > %s', prop);

    if (utils.isObject(prop)) {
      prop = utils.tableize(prop);
    }

    var opts = {};

    if (typeof prop === 'string') {
      var name = this._name.toLowerCase();
      var val;

      // global store
      if (prop === 'globals' || prop === 'global') {
        val = (this.globals && this.globals.data) || {};

      // "app" store
      } if (prop === 'store') {
        val = (this.store && this.store.data) || {};

      // package.json config
      } if (prop === 'pkg') {
        val = (this.pkg && this.pkg.data) || {};

      // package.json config
      } else if (prop.indexOf('config') === 0) {
        prop = prop.replace('config', name);
        val = this.pkg.get(prop);

      // other common objects
      } else {
        val = this.get(prop)
          || this.get(['cache', prop])
          || this.get(['cache.data', prop])
          || this.get(['options', prop]);
      }

      if (typeof val !== 'undefined') {
        // if `has` is defined, cast the value to boolean
        opts[prop] = has ? !!val : val;
        console.log(utils.formatValue(opts));
        next();
        return;
      }

      // if `has` is defined and we're here, then there is
      // no value, so make it `false`
      if (has) {
        opts[prop] = false;
        console.log(utils.formatValue(opts));
        next();
        return;
      }
    }

    if (prop === 'answers') {
      app.on('answers', console.log.bind(console));
      next();
      return;
    }

    if (prop === 'commands') {
      console.log(prop + '\n', app.commands.sort());
      next();
      return;
    }

    console.log('cannot find:', prop);
    next();
  };
};
