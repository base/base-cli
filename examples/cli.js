'use strict';

var argv = require('minimist')(process.argv.slice(2));
var Base = require('base');
var base = new Base();
var cli = require('..');

base.set('pkg.data', require('../package.json'));
base.use(cli());

base.cli.process(argv, function(err) {
  if (err) throw err;
});
