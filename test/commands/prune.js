var expect = require('expect.js');
var helpers = require('../helpers');

var prune = helpers.command('prune');

describe('bower home', function () {

    var mainPackage = new helpers.TempDir({
        'ano.json': {
            name: 'package',
            dependencies: {
                jquery: '*'
            }
        },
        'ano_libraries/jquery/jquery.js': 'jquery source'
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
            'ano_libraries/angular/angular.js': 'angular source',
            'ano_libraries/angular/.ano.json': {name: 'angular'}
        });

        return helpers.run(prune, [{}, {cwd: mainPackage.path}]).then(function () {
            expect(mainPackage.exists('ano_libraries/angular/angular.js'))
        .to.be(false);
        });
    });

    it('leaves non-bower packages', function () {
        mainPackage.prepare({
            'ano_libraries/angular/angular.js': 'angular source'
        });

        return helpers.run(prune, [{}, {cwd: mainPackage.path}]).then(function () {
            expect(mainPackage.exists('ano_libraries/angular/angular.js'))
        .to.be(true);
        });
    });

    it('deals with custom directory', function () {
        mainPackage.prepare({
            '.anorc': {directory: 'components'},
            'ano_libraries/angular/.ano.json': {name: 'angular'},
            'ano_libraries/angular/angular.js': 'angular source',
            'components/angular/.ano.json': {name: 'angular'},
            'components/angular/angular.js': 'angular source'
        });

        return helpers.run(prune, [{}, {cwd: mainPackage.path}]).then(function () {
            expect(mainPackage.exists('components/angular/angular.js')).to.be(false);
            expect(mainPackage.exists('ano_libraries/angular/angular.js')).to.be(true);
        });
    });
});
