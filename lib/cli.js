#!/usr/bin/env node
'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _mainJs = require('./main.js');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var argv = require('yargs').usage('Usage: electron-rebuild --version [version] --module-dir [path]').help('h').alias('h', 'help').describe('v', 'The version of Electron to build against').alias('v', 'version').describe('n', 'The NODE_MODULE_VERSION to compare against (process.versions.modules)').alias('n', 'node-module-version').describe('f', 'Force rebuilding modules, even if we would skip it otherwise').alias('f', 'force').describe('a', "Override the target architecture to something other than your system's").alias('a', 'arch').describe('m', 'The path to the node_modules directory to rebuild').alias('m', 'module-dir').describe('w', 'A specific module to build').alias('w', 'which-module').describe('e', 'The path to electron-prebuilt').alias('e', 'electron-prebuilt-dir').epilog('Copyright 2015').argv;

if (!argv.e) {
  argv.e = _path2['default'].join(__dirname, '..', '..', 'electron-prebuilt');
}

if (!argv.v) {
  // NB: We assume here that electron-prebuilt is a sibling package of ours
  var pkg = null;
  try {
    var pkgJson = _path2['default'].join(argv.e, 'package.json');

    pkg = require(pkgJson);

    argv.v = pkg.electronVersion;
  } catch (e) {
    console.error("Unable to find electron-prebuilt's version number, either install it or specify an explicit version");
    process.exit(-1);
  }
}

var electronPath = null;
var nodeModuleVersion = null;

if (!argv.n) {
  try {
    var pathDotText = _path2['default'].join(argv.e, 'path.txt');
    electronPath = _fs2['default'].readFileSync(pathDotText, 'utf8');
  } catch (e) {
    console.error("Couldn't find electron-prebuilt and no --node-module-version parameter set, always rebuilding");
  }
} else {
  nodeModuleVersion = parseInt(argv.n);
}

if (!argv.m) {
  // NB: We assume here that we're going to rebuild the immediate parent's
  // node modules, which might not always be the case but it's at least a
  // good guess
  try {
    argv.m = _path2['default'].resolve(__dirname, '../..');
  } catch (e) {
    console.error("Unable to find parent node_modules directory, specify it via --module-dir");
    process.exit(-1);
  }
}

if (!argv.w) {
  argv.w = null;
}

var shouldRebuildPromise = null;
if (!electronPath && !nodeModuleVersion) {
  shouldRebuildPromise = _Promise.resolve(true);
} else if (argv.f) {
  shouldRebuildPromise = _Promise.resolve(true);
} else {
  shouldRebuildPromise = (0, _mainJs.shouldRebuildNativeModules)(electronPath, nodeModuleVersion);
}

shouldRebuildPromise.then(function (x) {
  if (!x) process.exit(0);

  return (0, _mainJs.installNodeHeaders)(argv.v, null, null, argv.a).then(function () {
    return (0, _mainJs.rebuildNativeModules)(argv.v, argv.m, argv.w, null, argv.a);
  }).then(function () {
    return process.exit(0);
  });
})['catch'](function (e) {
  console.error(e.message);
  console.error(e.stack);
  process.exit(-1);
});