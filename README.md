# custom-resolve
Sugar way to customize substack's resolve, by setting default values for the options.

## Usage

example/style-resolve.js:

```javascript
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

// Or, you can set the default `basedir`
var resolve = resolver('style', {
    extensions: ['.css', '.scss'],
    basedir: __dirname + '/web_modules',
});

console.log(
    resolve.sync('./colors')
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
/Users/zoubin/usr/src/zoubin/custom-resolve/example/web_modules/colors/colors.scss
```

### resolve = resolver(pkgEntry, defaultOptions)

#### pkgEntry

Type: `String`

Default: `main`

#### defaultOptions

Exactly the same `options` used by [node-resolve](https://github.com/substack/node-resolve)
Those values specified in `defaultOptions` will be used as the default value for the options used by `resolve`

#### resolve(id, options, cb)

Type: `Function`

`resolve` has the same signature of [node-resolve](https://github.com/substack/node-resolve)

Some options specified by `defaultOptions` are just overwritten by those from `options`.
However, the others respect some defaulting rules

##### basedir

Type: `String`

directory to begin resolving from

The effective `basedir` is calculated in following order, stopped when a non-empty value generated:

1. `options.basedir`
2. `path.dirname(options.filename)`
3. `defaultOptions.basedir`
4. `path.dirname(caller())`

`call()` is the filename where `resolve` is called.

##### extensions

Type: `String`, `Array`

Default: `['.js']`

array of file extensions to search in order

The effective order:

1. `options.extensions`
2. `defaultOptions.extensions`

##### moduleDirectory

Type: `String`, `Array`

Default: `['node_modules']`

directory (or directories) in which to recursively look for modules.

The effective order:

1. `options.moduleDirectory`
2. `defaultOptions.moduleDirectory`

##### paths

Type: `String`, `Array`

Default: `[]`

require.paths array to use if nothing is found on the normal

The effective order:

1. `options.paths`
2. `defaultOptions.paths`

