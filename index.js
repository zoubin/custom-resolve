var resolver = require('resolve');
var mix = require('util-mix');
var path = require('path');
var caller = require('caller');

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
    return resolve;

    function resolve(id, opts, next) {
        if (typeof opts === 'function') {
            next = opts;
            opts = {};
        }
        opts = opts || {};
        return resolver(
            id,
            makeOpts(opts, opts.basedir || opts.filename || caller()),
            next
        );
    }

    function resolveSync(id, opts) {
        opts = opts || {};
        return resolver.sync(
            id,
            makeOpts(opts, opts.basedir || opts.filename || caller())
        );
    }

    function makeOpts(opts, filename) {
        opts = mix(
            { packageFilter: packageFilter },
            options,
            opts,
            {
                moduleDirectory: concat(
                    moduleDirectory, opts.moduleDirectory
                ),
                paths: concat(
                    options.paths, opts.paths
                ),
                extensions: concat(
                    extensions, opts.extensions
                ),
            }
        );
        if (!opts.basedir) {
            opts.basedir = path.dirname(filename);
        }
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
