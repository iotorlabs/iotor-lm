var expect = require('expect.js');
var md5 = require('md5-hex');
var helpers = require('../../helpers');

var cacheClean = helpers.command('cache/clean');
var object = require('mout/object');

describe('bower cache clean', function () {

  // Because directory names are required to be md5 of _source
  var cacheFilesFactory = function (spec) {
    var files = {};

    object.map(spec, function (anoJson) {
      anoJson._source = anoJson.name + '/' + anoJson.version;
      var path = md5(anoJson._source) + '/' + anoJson.version + '/.ano.json';
      files[path] = anoJson;
    });

    return files;
  };


  var cacheFiles = cacheFilesFactory([
    {
      name: 'angular',
      version: '1.3.8'
    },
    {
      name: 'angular',
      version: '1.3.9'
    },
    {
      name: 'jquery',
      version: '1.0.0'
    }
  ]);

  var cacheDir = new helpers.TempDir(cacheFiles);

  it('correctly reads arguments', function () {
    expect(cacheClean.readOptions(['jquery', 'angular']))
      .to.eql([['jquery', 'angular'], {}]);
  });

  it('removes all cache', function () {
    cacheDir.prepare();

    return helpers.run(cacheClean, [undefined, {}, {
      storage: {
        packages: cacheDir.path
      }
    }]).spread(function (result) {
      object.map(cacheFiles, function (_, cacheFile) {
        expect(cacheDir.exists(cacheFile)).to.be(false);
      });
    });
  });

  it('removes single package', function () {
    cacheDir.prepare();

    return helpers.run(cacheClean, [['angular'], {}, {
      storage: {
        packages: cacheDir.path
      }
    }]).spread(function (result) {
      var paths = Object.keys(cacheFiles);
      expect(cacheDir.exists(paths[0])).to.be(false);
      expect(cacheDir.exists(paths[1])).to.be(false);
      expect(cacheDir.exists(paths[2])).to.be(true);
    });
  });

  it('removes single package package version', function () {
    cacheDir.prepare();

    return helpers.run(cacheClean, [['angular#1.3.8'], {}, {
      storage: {
        packages: cacheDir.path
      }
    }]).spread(function (result) {
      var paths = Object.keys(cacheFiles);
      expect(cacheDir.exists(paths[0])).to.be(false);
      expect(cacheDir.exists(paths[1])).to.be(true);
      expect(cacheDir.exists(paths[2])).to.be(true);
    });
  });
});
