'use strict';

var store = require('data-store');
var expand = require('expand-args');
var argv = require('minimist')(process.argv.slice(2), {
  alias: {set: 's', get: 'g', del: 'd'}
});
var base = require('base-methods');
var option = require('base-options');
var data = require('base-data');
var cli = require('./');
var app = base()
  .define('store', store('base-cli-test'))
  .use(option)
  .use(data())
  .use(cli)

app.on('option', function (val, key) {
  console.log('option:', val, key);
});

app.store.on('set', function (val, key) {
  console.log('set:', val, key);
});
app.store.on('get', function (val, key) {
  console.log('get:', val, key);
});
app.store.on('del', function (key) {
  console.log('deleted:', key);
});

app.on('get', console.log);
app.on('has', console.log);
app.cli.process(expand(argv));


// app.cli.help();
// console.log(app.cli)

