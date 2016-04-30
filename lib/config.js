var tty = require('tty');
var object = require('mout').object;
var racoonConfig = require('racoon-config');
var Configstore = require('configstore');

var current;

function defaultConfig(config) {
  config = config || {};
  // config.registry = config.registry || 'https://bower.herokuapp.com'; // for test

  return readCachedConfig(config.cwd || process.cwd(), config);
}

function readCachedConfig(cwd, overwrites) {
  current = racoonConfig.create(cwd).load(overwrites);

  var config = current.toObject();

  var configstore = new Configstore('racoon-github').all;

  object.mixIn(config, configstore);

  var bin = process.env.BIN || 'rlm';
  // If interactive is auto (null), guess its value
  if (config.interactive == null) {
    config.interactive = (
      process.bin === bin &&
      tty.isatty(1) && !process.env.CI
    );
  }

  // Merge common CLI options into the config
  if (process.bin === bin) {
    var cli = require('./util/cli');

    object.mixIn(config, cli.readOptions({
      force: {type: Boolean, shorthand: 'f'},
      offline: {type: Boolean, shorthand: 'o'},
      verbose: {type: Boolean, shorthand: 'V'},
      quiet: {type: Boolean, shorthand: 'q'},
      loglevel: {type: String, shorthand: 'l'},
      json: {type: Boolean, shorthand: 'j'},
      silent: {type: Boolean, shorthand: 's'}
    }));
  }

  return config;
}

function restoreConfig() {
  if (current) {
    current.restore();
  }
}

function resetCache() {
  restoreConfig();
  current = undefined;
}

module.exports = defaultConfig;
module.exports.restore = restoreConfig;
module.exports.reset = resetCache;
