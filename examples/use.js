'use strict';

var expand = require('expand-args');
var argv = require('minimist')(process.argv.slice(2));
var base = require('base');
var store = require('base-store');
var cli = require('..');
var app = base()
  .use(store('base-cli-test'))
  .use(cli())

app.store.on('use', function (key) {
  console.log('[plugin]', key);
});
app.on('get', function (key, val) {
  console.log('[get]', key, '=>', val);
});

app.cli.process(argv);
// Try:
//
//  $ node examples/use.js --cwd=examples/plugins --use=a,b,c --get=a --get=b --get=c
//
