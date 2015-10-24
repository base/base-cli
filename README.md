# base-cli [![NPM version](https://badge.fury.io/js/base-cli.svg)](http://badge.fury.io/js/base-cli)

> Plugin for base-methods that maps built-in methods to CLI args (also supports methods from a few plugins, like 'base-store', 'base-options' and 'base-data'.

Adds a `cli` method to `base` for mapping parsed command line arguments existing [base](https://github.com/jonschlinkert/base-methods) methods or custom functions.

The goal is to simplify the process of settings up command line logic for your [base-methods](https://github.com/jonschlinkert/base-methods) application.

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i base-cli --save
```

## Usage

```js
var cli = require('base-cli');
var Base = require('base-methods');
var base = new Base();

// register the `cli` plugin with [base-methods][]:
base.use(cli());
```

## API

This adds a `cli` object to `base` with the following (chainable) methods (`base.cli.*`):

* `.map()` -  [.map](#map): add mappings from command line flags/options to custom functions or `base` methods
* `.alias()` -  [.alias](#alias): similar to `map` but creates simple aliases. For example, `alias('show', 'get')` would invoke the `.get()` method when `--show` is passed on the command line
* `.process()` -  [.process](#process): once all mappings are defined, pass `argv` to `.process()` to iterate over the mappings, passing `argv` as context.

## Example

```js
var expand = require('expand-args');
var argv = require('minimist')(process.argv.slice(2));
var Base = require('base-methods');
var cli = require('base-cli');

var base = new Base();
base.use(cli());

base.cli
  .map('set')
  .map('get', console.log)
  .map('del', console.log)
  .alias('foo', 'get');

base.cli.process(expand(argv));

// command line args:
//   
//   '--set=a:b --get=a'
//   
// prints:
//   
//   'a'
//   
```

## Other plugins

If none of the following plugins meet your needs, feel free to use them as examples for creating your own!

* [base-data](https://www.npmjs.com/package/base-data): adds a `data` method to base-methods. | [homepage](https://github.com/jonschlinkert/base-data)
* [base-methods](https://www.npmjs.com/package/base-methods): Starter for creating a node.js application with a handful of common methods, like `set`, `get`,… [more](https://www.npmjs.com/package/base-methods) | [homepage](https://github.com/jonschlinkert/base-methods)
* [base-options](https://www.npmjs.com/package/base-options): Adds a few options methods to base-methods, like `option`, `enable` and `disable`. See the readme… [more](https://www.npmjs.com/package/base-options) | [homepage](https://github.com/jonschlinkert/base-options)
* [base-plugins](https://www.npmjs.com/package/base-plugins): Upgrade's plugin support in base-methods to allow plugins to be called any time after init. | [homepage](https://github.com/jonschlinkert/base-plugins)
* [base-store](https://www.npmjs.com/package/base-store): Plugin for getting and persisting config values with your base-methods application. Adds a 'store' object… [more](https://www.npmjs.com/package/base-store) | [homepage](https://github.com/jonschlinkert/base-store)

## Tests

### Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

### Coverage

```sh
Statements : 100% (13/13)
Branches   : 100% (2/2)
Functions  : 100% (4/4)
Lines      : 100% (12/12)
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/base-cli/issues/new).

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on October 24, 2015._