'use strict';

var argv = require('minimist')(process.argv.slice(2));
var expand = require('expand-args');
var Base = require('base-methods');
var cli = require('..');
var base = new Base();
base.use(cli());

base.cli
  .map('set')
  .map('get', console.log)
  .map('del', console.log)
  .alias('foo', 'get');

base.cli.process(expand(argv));
// try: '--set=a:b --get=a'
