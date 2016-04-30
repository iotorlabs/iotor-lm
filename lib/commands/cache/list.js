var mout = require('mout');
var PackageRepository = require('../../core/PackageRepository');
var defaultConfig = require('../../config');

function list(logger, libraries, options, config) {
  var repository;

  config = defaultConfig(config);
  repository = new PackageRepository(config, logger);

  // If libraries is an empty array, null them
  if (libraries && !libraries.length) {
    libraries = null;
  }

  return repository.list()
    .then(function (entries) {
      if (libraries) {
        // Filter entries according to the specified libraries
        entries = entries.filter(function (entry) {
          return !!mout.array.find(libraries, function (pkg) {
            return pkg === entry.pkgMeta.name;
          });
        });
      }

      return entries;
    });
}

// -------------------

list.readOptions = function (argv) {
  var cli = require('../../util/cli');
  var options = cli.readOptions(argv);
  var libraries = options.argv.remain.slice(2);

  delete options.argv;

  return [libraries, options];
};

module.exports = list;
