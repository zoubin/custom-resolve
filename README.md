# custom-resolve
[![version](https://img.shields.io/npm/v/custom-resolve.svg)](https://www.npmjs.org/package/custom-resolve)
[![status](https://travis-ci.org/zoubin/custom-resolve.svg?branch=master)](https://travis-ci.org/zoubin/custom-resolve)
[![coverage](https://img.shields.io/coveralls/zoubin/custom-resolve.svg)](https://coveralls.io/github/zoubin/custom-resolve)
[![dependencies](https://david-dm.org/zoubin/custom-resolve.svg)](https://david-dm.org/zoubin/custom-resolve)
[![devDependencies](https://david-dm.org/zoubin/custom-resolve/dev-status.svg)](https://david-dm.org/zoubin/custom-resolve#info=devDependencies)

Return a function works like substack's [`node-resolve`], with some options set by default.

## Example

```
⌘ tree example/
example/
├── node_modules
│   └── colors
│       ├── colors.scss
│       └── package.json
├── resolve.js
└── style_modules
    └── red
        └── index.scss
```

example/node_modules/colors/package.json:
```json
{
  "style": "colors"
}
```

example/resolve.js:

```javascript
var resolver = require('..')
var path = require('path')

var resolve = resolver({
  main: 'style',
  extensions: ['.scss'],
})

resolve('colors', function (err, file) {
  console.log(path.relative(__dirname, file))
})

console.log(
  path.relative(__dirname, resolve.sync('./red', {
    basedir: path.join(__dirname, 'style_modules'),
  }))
)

```

output:

```
⌘ node example/resolve.js
style_modules/red/index.scss
node_modules/colors/colors.scss

```

## Breaking changes in v1.0.0

* The options specified will be treated as the default options for [`node-resolve`], and when the returned custom resolve function called, options passed to it will **overwrite** the corresponding default options.
* The `packageEntry` option is replaced by `main`.
* The `symlinks` option is replaced by `symlink`. Check [`symlink`](#symlink) for more details.
* The API only receives one argument.

## resolve = resolver(defaultOptions)

Return a function like [`node-resolve`],
with some of the options set by default according to `defaultOptions`.

When `resolve` is called with extra options,
they **overwrite** those in `defaultOptions`.

Besides all options supported by [`node-resolve`],
`defaultOptions` supports the following options.

Refer to [`node-resolve`] for more information about supported options.

### main
Specify the package entry.
If `defaultOptions` is `String`, it is treated as the `main` option.

Type: `String`

Default: `main`


### symlink
Specify how to treat symlinks in the top `node_modules` directory.

Type: `true`

All symlinks will be resolved to their realpaths.

Type: `Array`, `String`

Only those specified will be resolved to realpaths.

Type: `Function`

Signature: `needRealpath = symlink(file)`

Realpaths are used only when this function returns a truthy value.

[`node-resolve`]: https://github.com/substack/node-resolve
