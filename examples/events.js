'use strict';

var expand = require('expand-args');
var argv = require('minimist')(process.argv.slice(2), {
  alias: {set: 's', get: 'g', del: 'd'}
});
var store = require('base-store');
var option = require('base-option');
var data = require('base-data');
var base = require('base');
var cli = require('..');
var app = base()
  .use(store('base-cli-test'))
  .use(option)
  .use(data())
  .use(cli())

app.on('set', function (key, val) {
  console.log('[set]', key, '=>', val);
});
app.store.on('set', function (key, val) {
  console.log('[store.set]', key, '=>', val);
});
app.on('option', function (key, val) {
  console.log('[option]', key, '=>', val);
});
app.on('data', function (args) {
  console.log('[data]', args);
});

// try these:
//
//   $ node examples/events.js --set=foo:bar
//   $ node examples/events.js --store.set=one:two
//   $ node examples/events.js --data=foo:a,b,c
//   $ node examples/events.js --enable=lint
//
app.cli.process(expand(argv), function(err) {
  if (err) throw err;
});
