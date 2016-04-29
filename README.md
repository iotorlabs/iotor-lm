# ano-lm: An arduino library manager

> ano-lm needs is forked from [Bower](https://github.com/bower/bower)

[![Build Status](https://travis-ci.org/taoyuan/ano-lm.svg?branch=master)](https://travis-ci.org/taoyuan/ano-lm)
[![Windows Build](https://ci.appveyor.com/api/projects/status/jr6vfra8w84plh2g/branch/master?svg=true)](https://ci.appveyor.com/project/sheerun/bower/history)
[![Coverage Status](https://img.shields.io/coveralls/taoyuan/ano-lm.svg)](https://coveralls.io/r/taoyuan/ano-lm?branch=master)
[![Issue Stats](http://issuestats.com/github/taoyuan/ano-lm/badge/pr?style=flat)](http://issuestats.com/github/taoyuan/ano-lm)
[![Issue Stats](http://issuestats.com/github/taoyuan/ano-lm/badge/issue?style=flat)](http://issuestats.com/github/taoyuan/ano-lm)

---


## Install

```sh
$ npm install -g ano-lm
```

ANO LM depends on [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/). Also make sure that [git](http://git-scm.com/) is installed as some bower
libraries require it to be fetched and installed.


## Usage

See complete command line reference at [bower.io/docs/api/](http://bower.io/docs/api/)

### Installing libraries and dependencies

```sh
# install dependencies listed in library.json
$ alm install

# install a library and add it to library.json
$ alm install <library> --save

# install specific version of a library and add it to library.json
$ alm install <library>#<version> --save
```

### Uninstalling libraries

To uninstall a locally installed library:

```sh
$ alm uninstall <library-name>
```

### prezto and oh-my-zsh users

On `prezto` or `oh-my-zsh`, do not forget to `alias alm='noglob alm'` or `alm install jquery\#1.9.1`

### Never run Bower with sudo

Bower is a user command; there is no need to execute it with superuser permissions.

### Windows users

To use Bower on Windows, you must install
[Git for Windows](http://git-for-windows.github.io/) correctly. Be sure to check the
options shown below:

<img src="https://cloud.githubusercontent.com/assets/10702007/10532690/d2e8991a-7386-11e5-9a57-613c7f92e84e.png" width="534" height="418" alt="Git for Windows" />

<img src="https://cloud.githubusercontent.com/assets/10702007/10532694/dbe8857a-7386-11e5-9bd0-367e97644403.png" width="534" height="418" alt="Git for Windows" />

Note that if you use TortoiseGit and if Bower keeps asking for your SSH
password, you should add the following environment variable: `GIT_SSH -
C:\Program Files\TortoiseGit\bin\TortoisePlink.exe`. Adjust the `TortoisePlink`
path if needed.

### Ubuntu users

To use Bower on Ubuntu, you might need to link `nodejs` executable to `node`:

```
sudo ln -s /usr/bin/nodejs /usr/bin/node
```

## Configuration

ANO LM can be configured using JSON in a `.anorc` file. Read over available options at [bower.io/docs/config](http://bower.io/docs/config).

## License

Licensed under the MIT License
