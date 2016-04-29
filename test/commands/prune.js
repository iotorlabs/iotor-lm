var expect = require('expect.js');
var helpers = require('../helpers');

var prune = helpers.command('prune');

describe('bower home', function () {

  var mainPackage = new helpers.TempDir({
    'library.json': {
      name: 'package',
      dependencies: {
        jquery: '*'
      }
    },
    'libraries/jquery/jquery.js': 'jquery source'
  });

  it('correctly reads arguments', function () {
    expect(prune.readOptions(['-p']))
      .to.eql([{production: true}]);
  });

  it('correctly reads long arguments', function () {
    expect(prune.readOptions(['--production']))
      .to.eql([{production: true}]);
  });

  it('removes extraneous packages', function () {
    mainPackage.prepare({
      'libraries/angular/angular.js': 'angular source',
      'libraries/angular/.library.json': {name: 'angular'}
    });

    return helpers.run(prune, [{}, {cwd: mainPackage.path}]).then(function () {
      expect(mainPackage.exists('libraries/angular/angular.js'))
        .to.be(false);
    });
  });

  it('leaves non-bower packages', function () {
    mainPackage.prepare({
      'libraries/angular/angular.js': 'angular source'
    });

    return helpers.run(prune, [{}, {cwd: mainPackage.path}]).then(function () {
      expect(mainPackage.exists('libraries/angular/angular.js'))
        .to.be(true);
    });
  });

  it('deals with custom directory', function () {
    mainPackage.prepare({
      '.anorc': {directory: 'components'},
      'libraries/angular/.library.json': {name: 'angular'},
      'libraries/angular/angular.js': 'angular source',
      'components/angular/.library.json': {name: 'angular'},
      'components/angular/angular.js': 'angular source'
    });

    return helpers.run(prune, [{}, {cwd: mainPackage.path}]).then(function () {
      expect(mainPackage.exists('components/angular/angular.js')).to.be(false);
      expect(mainPackage.exists('libraries/angular/angular.js')).to.be(true);
    });
  });
});
