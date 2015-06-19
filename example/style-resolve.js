var resolver = require('..');

var resolve = resolver('style', {
    extensions: ['.css', '.scss'],
    moduleDirectory: ['web_modules', 'node_modules'],
});

console.log(
    resolve.sync(
        'colors',
        { filename: __filename }
    )
)
