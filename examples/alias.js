'use strict';

var argv = require('minimist')(process.argv.slice(2));
var expand = require('expand-args');
var plugins = require('base-plugins');
var option = require('base-option');
var store = require('base-store');
var data = require('base-data');
var base = require('base');
var cli = require('../');

var app = base()
  .use(plugins)
  .use(option)
  .use(store('foo'))
  .use(data())
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

/**
 * $ node examples/alias --set=foo:bar --set=baz:qux
 */

app.cli.process(expand(argv), function(err) {
  if (err) throw err;
});

