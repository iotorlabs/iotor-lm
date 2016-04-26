process.bin = process.title = process.env.BIN || 'anom';

var Q = require('q');
var mout = require('mout');
var Logger = require('bower-logger');
var userHome = require('user-home');
var anom = require('../');
var version = require('../version');
var cli = require('../util/cli');
var rootCheck = require('../util/rootCheck');

var options;
var renderer;
var loglevel;
var command;
var commandFunc;
var logger;
var levels = Logger.LEVELS;

var defer = Q.defer();
module.exports = defer.promise;


options = cli.readOptions({
  'version': {type: Boolean, shorthand: 'v'},
  'help': {type: Boolean, shorthand: 'h'},
  'allow-root': {type: Boolean}
});

// Handle print of version
if (options.version) {
  process.stdout.write(version + '\n');
  process.exit();
}

// Root check
rootCheck(options, anom.config);

// Set loglevel
if (anom.config.silent) {
  loglevel = levels.error;
} else if (anom.config.verbose) {
  loglevel = -Infinity;
  Q.longStackSupport = true;
} else if (anom.config.quiet) {
  loglevel = levels.warn;
} else {
  loglevel = levels[anom.config.loglevel] || levels.info;
}

// Get the command to execute
while (options.argv.remain.length) {
  command = options.argv.remain.join(' ');

  // Alias lookup
  if (anom.abbreviations[command]) {
    command = anom.abbreviations[command].replace(/\s/g, '.');
    break;
  }

  command = command.replace(/\s/g, '.');

  // Direct lookup
  if (mout.object.has(anom.commands, command)) {
    break;
  }

  options.argv.remain.pop();
}

// Execute the command
commandFunc = command && mout.object.get(anom.commands, command);
command = command && command.replace(/\./g, ' ');

// If no command was specified, show anom help
// Do the same if the command is unknown
if (!commandFunc) {
  logger = anom.commands.help();
  command = 'help';
// If the user requested help, show the command's help
// Do the same if the actual command is a group of other commands (e.g.: cache)
} else if (options.help || !commandFunc.line) {
  logger = anom.commands.help(command);
  command = 'help';
// Call the line method
} else {
  logger = commandFunc.line(process.argv);

  // If the method failed to interpret the process arguments
  // show the command help
  if (!logger) {
    logger = anom.commands.help(command);
    command = 'help';
  }
}

// Get the renderer and configure it with the executed command
renderer = cli.getRenderer(command, logger.json, anom.config);

function handleLogger(logger, renderer) {
  logger
    .on('end', function (data) {
      if (!anom.config.silent && !anom.config.quiet) {
        renderer.end(data);
      }
      defer.resolve();
    })
    .on('error', function (err) {
      if (command !== 'help' && err.code === 'EREADOPTIONS') {
        logger = anom.commands.help(command);
        renderer = cli.getRenderer('help', logger.json, anom.config);
        handleLogger(logger, renderer);
      } else {
        if (levels.error >= loglevel) {
          renderer.error(err);
        }
        defer.reject(err);
        process.exit(1);
      }
    })
    .on('log', function (log) {
      if (levels[log.level] >= loglevel) {
        renderer.log(log);
      }
    })
    .on('prompt', function (prompt, callback) {
      renderer.prompt(prompt)
        .then(function (answer) {
          callback(answer);
        });
    });
}

handleLogger(logger, renderer);

// Warn if HOME is not SET
if (!userHome) {
  logger.warn('no-home', 'HOME environment variable not set. User config will not be loaded.');
}

if (anom.config.interactive) {
  var updateNotifier = require('update-notifier');

  // Check for newer version of Ano
  var notifier = updateNotifier({pkg: {name: 'anom', version: version}});

  if (notifier.update && levels.info >= loglevel) {
    notifier.notify();
  }
}

