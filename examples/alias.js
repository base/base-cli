'use strict';

var argv = require('minimist')(process.argv.slice(2));
var expand = require('expand-args');
var base = require('base-methods');
var plugins = require('base-plugins');
var options = require('base-options');
var store = require('base-store');
var data = require('base-data');
var cli = require('./');

var app = base()
  .use(plugins)
  .use(options)
  .use(store('foo'))
  .use(data('bar'))
  .use(cli())

app.cli({
  s: 'set',
  g: 'get',
  h: 'has',
  d: 'del'
});

app.on('set', function (val, key) {
  console.log('set:', val, key);
});

app.cli.process(expand(argv));

