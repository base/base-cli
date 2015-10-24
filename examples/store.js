'use strict';

var expand = require('expand-args');
var argv = require('minimist')(process.argv.slice(2), {
  alias: {set: 's', get: 'g', del: 'd'}
});
var base = require('base-methods');
var store = require('base-store');
var cli = require('..');
var app = base()
  .use(store('base-cli-test'))
  .use(cli())

app.store.on('set', function (key, val) {
  console.log('[store] set', key, '=>', val);
});
app.store.on('get', function (key, val) {
  console.log('[store] got', key, '=>', val);
});
app.store.on('del', function (key) {
  console.log('[store] deleted =>', key);
});

app.cli.process(expand(argv));
// Try:
//
//  'node examples/store.js --store.set=a:b --store.get=a --store.del=a'
//
