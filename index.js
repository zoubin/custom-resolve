var resolver = require('resolve');
var mix = require('util-mix');
var path = require('path');
var caller = require('caller');
var realpathify = require('realpathify');

module.exports = custom;

function custom(pkgEntry, options) {
    if (typeof pkgEntry === 'object') {
        options = pkgEntry;
        pkgEntry = 'main';
    }
    resolve.sync = resolveSync;
    options = options || {};
    var extensions = options.extensions
        ? [].concat(options.extensions)
        : ['.js'];
    var moduleDirectory = options.moduleDirectory
        ? [].concat(options.moduleDirectory)
        : ['node_modules'];
    if (options.symlinks) {
        var ret = realpathify.async(resolve, options.symlinks === true ? [] : options.symlinks);
        ret.sync = realpathify.sync(resolve.sync, options.symlinks === true ? [] : options.symlinks);
        return ret;
    }
    return resolve;

    function resolve(id, opts, next) {
        if (typeof opts === 'function') {
            next = opts;
            opts = {};
        }
        opts = opts || {};
        var basedir = getBasedir(opts) || path.dirname(caller());
        return resolver(
            id,
            makeOpts(opts, basedir),
            next
        );
    }

    function resolveSync(id, opts) {
        opts = opts || {};
        var basedir = getBasedir(opts) || path.dirname(caller());
        return resolver.sync(
            id,
            makeOpts(opts, basedir)
        );
    }

    function getBasedir(opts) {
        return opts.basedir || opts.filename &&
               path.dirname(opts.filename) ||
               options.basedir;
    }

    function makeOpts(opts, basedir) {
        opts = mix(
            { packageFilter: packageFilter },
            options,
            opts,
            {
                basedir: basedir,
                moduleDirectory: concat(
                    opts.moduleDirectory,
                    moduleDirectory
                ),
                paths: concat(
                    opts.paths,
                    options.paths
                ),
                extensions: concat(
                    opts.extensions,
                    extensions
                ),
            }
        );
        return opts;
    }

    function packageFilter(pkg) {
        pkg.main = pkg[pkgEntry] ? pkg[pkgEntry] : 'index';
        return pkg;
    }
}

function concat() {
    return Array.prototype.concat.apply([], arguments).filter(Boolean);
}
