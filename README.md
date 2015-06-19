# custom-resolve
Sugar way to customize substack's resolve

## Usage

example/style-resolve.js:

```javascript
var resolver = require('custom-resolve');

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
```

output:

```
⌘ tree example/
example/
├── style-resolve.js
└── web_modules
    └── colors
        ├── colors.scss
        └── package.json

```

```
⌘ node example/style-resolve.js
/Users/zoubin/usr/src/zoubin/custom-resolve/example/web_modules/colors/colors.scss
```

### resolve = resolver(pkgEntry, options)

`resolve` has the same signature of [node-resolve](https://github.com/substack/node-resolve), except that if no `basedir` is given, a `filename` field will be used to calculate a `basedir`. `filename` is the caller's path by default.

#### pkgEntry

Type: `String`
Default: `main`

#### options

Exactly the same `options` as that used by [node-resolve](https://github.com/substack/node-resolve)
