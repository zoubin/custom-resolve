var resolver = require('resolve');
var merge = require('util-mix').merge;
var path = require('path');
var caller = require('caller');

module.exports = custom;

function custom(pkgEntry, options) {
    if (typeof pkgEntry === 'object') {
        options = pkgEntry;
        pkgEntry = 'main';
    }
    resolve.sync = resolveSync;
    return resolve;

    function resolve(id, opts, next) {
        if (typeof opts === 'function') {
            next = opts;
            opts = {};
        }
        return resolver(
            id,
            makeOpts(merge({ filename: caller() }, options, opts)),
            next
        );
    }

    function resolveSync(id, opts) {
        return resolver.sync(
            id,
            makeOpts(merge({ filename: caller() }, options, opts))
        );
    }

    function makeOpts(opts) {
        opts = merge(
            { packageFilter: packageFilter },
            opts
        );
        if (!opts.basedir) {
            opts.basedir = path.dirname(opts.filename);
        }
        return opts;
    }

    function packageFilter(pkg) {
        pkg.main = pkg[pkgEntry] ? pkg[pkgEntry] : 'index';
        return pkg;
    }
}
