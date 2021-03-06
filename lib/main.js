'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _this = this;

exports.installNodeHeaders = installNodeHeaders;
exports.shouldRebuildNativeModules = shouldRebuildNativeModules;
exports.rebuildNativeModules = rebuildNativeModules;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _spawn = require('./spawn');

var _spawn2 = _interopRequireDefault(_spawn);

var _promisify = require('./promisify');

var _promisify2 = _interopRequireDefault(_promisify);

var fs = (0, _promisify2['default'])(require('fs'));

var getHeadersRootDirForVersion = function getHeadersRootDirForVersion(version) {
  return _path2['default'].resolve(__dirname, 'headers');
};

var checkForInstalledHeaders = function checkForInstalledHeaders(nodeVersion, headersDir) {
  var canary, stat;
  return _regeneratorRuntime.async(function checkForInstalledHeaders$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        canary = _path2['default'].join(headersDir, '.node-gyp', nodeVersion, 'common.gypi');
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(fs.stat(canary));

      case 3:
        stat = context$1$0.sent;

        if (stat) {
          context$1$0.next = 6;
          break;
        }

        throw new Error("Canary file 'common.gypi' doesn't exist");

      case 6:
        return context$1$0.abrupt('return', true);

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

var spawnWithHeadersDir = function spawnWithHeadersDir(cmd, args, headersDir, cwd) {
  var env, opts;
  return _regeneratorRuntime.async(function spawnWithHeadersDir$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        env = _lodash2['default'].extend({}, process.env, { HOME: headersDir });

        if (process.platform === 'win32') {
          env.USERPROFILE = env.HOME;
        }

        context$1$0.prev = 2;
        opts = { env: env };

        if (cwd) {
          opts.cwd = cwd;
        }

        context$1$0.next = 7;
        return _regeneratorRuntime.awrap((0, _spawn2['default'])({ cmd: cmd, args: args, opts: opts }));

      case 7:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 10:
        context$1$0.prev = 10;
        context$1$0.t0 = context$1$0['catch'](2);

        if (context$1$0.t0.stdout) console.log(context$1$0.t0.stdout);
        if (context$1$0.t0.stderr) console.log(context$1$0.t0.stderr);

        throw context$1$0.t0;

      case 15:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[2, 10]]);
};

var getElectronModuleVersion = function getElectronModuleVersion(pathToElectronExecutable) {
  var args, env, result, versionAsString;
  return _regeneratorRuntime.async(function getElectronModuleVersion$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        args = ['-e', 'console.log(process.versions.modules)'];
        env = { ATOM_SHELL_INTERNAL_RUN_AS_NODE: '1' };
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap((0, _spawn2['default'])({ cmd: pathToElectronExecutable, args: args, opts: { env: env } }));

      case 4:
        result = context$1$0.sent;
        versionAsString = (result.stdout + result.stderr).replace(/\n/g, '');

        if (versionAsString.match(/^\d+$/)) {
          context$1$0.next = 8;
          break;
        }

        throw new Error('Failed to check Electron\'s module version number: ' + versionAsString);

      case 8:
        return context$1$0.abrupt('return', toString(versionAsString));

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this);
};

function installNodeHeaders(nodeVersion) {
  var nodeDistUrl = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
  var headersDir = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
  var arch = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
  var distUrl, cmd, args;
  return _regeneratorRuntime.async(function installNodeHeaders$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        headersDir = headersDir || getHeadersRootDirForVersion(nodeVersion);
        distUrl = nodeDistUrl || 'https://gh-contractor-zcbenz.s3.amazonaws.com/atom-shell/dist';
        context$1$0.prev = 2;
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(checkForInstalledHeaders(nodeVersion, headersDir));

      case 5:
        return context$1$0.abrupt('return');

      case 8:
        context$1$0.prev = 8;
        context$1$0.t0 = context$1$0['catch'](2);

      case 10:
        cmd = 'node';
        args = [require.resolve('npm/node_modules/node-gyp/bin/node-gyp'), 'install', '--target=' + nodeVersion, '--arch=' + (arch || process.arch), '--dist-url=' + distUrl];
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(spawnWithHeadersDir(cmd, args, headersDir));

      case 14:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[2, 8]]);
}

function shouldRebuildNativeModules(pathToElectronExecutable) {
  var explicitNodeVersion = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
  var args, version;
  return _regeneratorRuntime.async(function shouldRebuildNativeModules$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        args = ['-e', 'require("nslog")'];
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap((0, _spawn2['default'])({ cmd: process.execPath, args: args }));

      case 4:

        require('nslog');
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0['catch'](0);
        return context$1$0.abrupt('return', true);

      case 10:
        context$1$0.t1 = explicitNodeVersion;

        if (context$1$0.t1) {
          context$1$0.next = 15;
          break;
        }

        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(getElectronModuleVersion(pathToElectronExecutable));

      case 14:
        context$1$0.t1 = context$1$0.sent;

      case 15:
        version = context$1$0.t1;

        if (!(version === process.versions.modules)) {
          context$1$0.next = 18;
          break;
        }

        return context$1$0.abrupt('return', false);

      case 18:
        return context$1$0.abrupt('return', true);

      case 19:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 7]]);
}

function rebuildNativeModules(nodeVersion, nodeModulesPath) {
  var whichModule = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
  var headersDir = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
  var arch = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
  var cmd, args;
  return _regeneratorRuntime.async(function rebuildNativeModules$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        headersDir = headersDir || getHeadersRootDirForVersion(nodeVersion);
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(checkForInstalledHeaders(nodeVersion, headersDir));

      case 3:
        cmd = 'node';
        args = [require.resolve('npm/bin/npm-cli'), 'rebuild'];

        if (whichModule) {
          args.push(whichModule);
        }

        args.push('--runtime=electron', '--target=' + nodeVersion, '--arch=' + (arch || process.arch));

        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(spawnWithHeadersDir(cmd, args, headersDir, nodeModulesPath));

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

// Try to load our canary module - if it fails, we know that it's built
// against a different node module than ours, so we're good
//
// NB: Apparently on OS X, this not only fails to be required, it segfaults
// the process, because lol.

// We need to check the native module version of Electron vs ours - if they
// happen to be the same, we're good

// If we loaded nslog and the versions don't match, we've got to rebuild