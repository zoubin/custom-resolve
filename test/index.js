var resolver = require('..');
var test = require('tape');
var path = require('path');

function fixtures() {
    return path.resolve.bind(path, __dirname, "fixtures").apply(null, arguments);
}

test('styleResolve', function(t) {
    t.plan(5);

    var resolve = resolver('style', {
        extensions: ['.css', '.scss'],
        moduleDirectory: ['web_modules', 'node_modules'],
    });

    resolve(
        './default',
        { basedir: fixtures('local_modules') },
        function (err, res) {
            t.equal(
                res,
                fixtures('local_modules', 'default', 'index.css'),
                'local_modules, defaults to index.css'
            );
        }
    );
    resolve(
        './style',
        { basedir: fixtures('local_modules') },
        function (err, res) {
            t.equal(
                res,
                fixtures('local_modules', 'style', 'style.css'),
                'local_modules, uses style field in package.json'
            );
        }
    );
    t.equal(
        resolve.sync(
            'default',
            { basedir: fixtures() }
        ),
        fixtures('web_modules', 'default', 'index.scss'),
        'web_modules, defaults to index.scss'
    );
    t.equal(
        resolve.sync(
            'style',
            { filename: fixtures('fake.js') }
        ),
        fixtures('node_modules', 'style', 'style.scss'),
        'node_modules, should respect the filename filed'
    );
    t.equal(
        resolve.sync('./' + path.basename(__filename)),
        __filename,
        "should use the caller's filename if neither of `basedir` and `filename` set "
    );
})

