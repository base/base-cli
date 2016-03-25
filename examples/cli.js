'use strict';

var argv = require('minimist')(process.argv.slice(2));
var Base = require('base');
var app = new Base();
var cli = require('..');

app.set('pkg.data', require('../package.json'));
app.use(cli());

app.cli.process(argv, function(err) {
  if (err) throw err;
});
