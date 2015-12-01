var resolver = require('resolve')
var path = require('path')
var caller = require('caller')
var fs = require('fs')
var mix = require('mixy')

module.exports = function (options) {
  if (typeof options === 'string') {
    options = { main: options }
  }

  options = options || {}
  options.packageFilter = function (pkg) {
    pkg.main = pkg[options.main || 'main'] || 'index'
    return pkg
  }

  function buildOptions(opts) {
    opts = mix({}, options, opts)

    if (!opts.basedir && opts.filename) {
      opts.basedir = path.dirname(opts.filename)
    }

    return opts
  }

  function resolve(id, opts, next) {
    if (typeof opts === 'function') {
      next = opts
      opts = {}
    }

    opts = buildOptions(opts)
    if (!opts.basedir) {
      opts.basedir = path.dirname(caller())
    }

    return resolver(id, opts, function (err, res) {
      if (!err) {
        res = realpath(res, options.symlink)
      }
      next.apply(null, [err, res].concat(slice(arguments, 2)))
    })
  }

  function resolveSync(id, opts) {
    opts = buildOptions(opts)
    if (!opts.basedir) {
      opts.basedir = path.dirname(caller())
    }
    if (opts.extensions && !Array.isArray(opts.extensions)) {
      opts.extensions = [opts.extensions]
    }

    return realpath(resolver.sync(id, opts), options.symlink)
  }

  resolve.sync = resolveSync
  return resolve
}

function realpath(file, symlink) {
  if (symlink === true) {
    return fs.realpathSync(file)
  }
  if (typeof symlink === 'function') {
    return symlink(file) ? fs.realpathSync(file) : file
  }
  if (symlink && [].concat(symlink).indexOf(extractNodeModuleDir(file)) !== -1) {
    return fs.realpathSync(file)
  }
  return file
}

function extractNodeModuleDir(file) {
  var m = file.split('/node_modules/')[1]
  if (!m) return file
  return m.split('/')[0] || file
}

function slice(o, from, to) {
  return Array.prototype.slice.call(o, from, to)
}

