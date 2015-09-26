var resolver = require('resolve');
var mix = require('util-mix');
var path = require('path');
var caller = require('caller');
var fs = require('fs');

module.exports = function (pkgEntry, options) {
  if (typeof pkgEntry === 'object') {
    options = pkgEntry || {};
    pkgEntry = options.packageEntry || 'main';
  }

  options = options || {};
  options.pkgEntry = pkgEntry;

  function resolve(id, opts, next) {
    if (typeof opts === 'function') {
      next = opts;
      opts = {};
    }
    opts = opts || {};
    var basedir = getBasedir(opts, options.basedir) || path.dirname(caller());
    return resolver(
      id,
      makeOpts(options, opts, basedir),
      function (err, file) {
        if (!err && file) {
          file = realpath(file, options);
        }
        next(err, file);
      }
    );
  }

  function resolveSync(id, opts) {
    opts = opts || {};
    var basedir = getBasedir(opts, options.basedir) || path.dirname(caller());
    return realpath(
      resolver.sync(
        id,
        makeOpts(options, opts, basedir)
      ),
      options
    );
  }

  resolve.sync = resolveSync;
  return resolve;
};

function concat() {
  return Array.prototype.concat.apply([], arguments)
    .filter(Boolean);
}

function getBasedir(opts, fallback) {
  return opts.basedir ||
    opts.filename && path.dirname(opts.filename) ||
    fallback;
}

function realpath(file, options) {
  options = options || {};
  var symlinks = options.symlinks;
  if (symlinks === true) {
    return fs.realpathSync(file);
  }
  if (typeof symlinks === 'function') {
    return symlinks(file) ? fs.realpathSync(file) : file;
  }
  if (symlinks && typeof symlinks.test === 'function') {
    return symlinks.test(file) ? fs.realpathSync(file) : file;
  }
  if (symlinks && [].concat(symlinks).indexOf(extractNodeModuleDir(file)) !== -1) {
    return fs.realpathSync(file);
  }
  return file;
}

function extractNodeModuleDir(file) {
  var m = file.split('/node_modules/')[1];
  if (m) {
    return m.split('/')[0] || file;
  }
  return file;
}

function makeOpts(options, opts, basedir) {
  var packageFilter = opts.packageFilter;
  return mix(
    {},
    options,
    opts,
    {
      basedir: basedir,
      packageFilter: function (pkg, pkgfile) {
        if (typeof packageFilter === 'function') {
          pkg = packageFilter(pkg, pkgfile);
        }
        pkg.main = pkg[options.pkgEntry] || 'index';
        return pkg;
      },
      moduleDirectory: concat(
        opts.moduleDirectory,
        options.moduleDirectory || 'node_modules'
      ),
      paths: concat(
        opts.paths,
        options.paths
      ),
      extensions: concat(
        opts.extensions,
        options.extensions || '.js'
      ),
    }
  );
}

