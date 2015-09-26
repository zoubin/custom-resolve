# custom-resolve
Sugar way to customize substack's resolve, by setting default values for the options.

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
var resolver = require('..');
var path = require('path');

var resolve = resolver({
  packageEntry: 'style',
  extensions: ['.scss'],
});

var colorsPath = path.join(
  __dirname, 'node_modules', 'colors', 'colors.scss'
);
var redPath = path.join(
  __dirname, 'style_modules', 'red', 'index.scss'
);

resolve('colors', function (err, file) {
  console.log(
    '\nExpected:',
    colorsPath,
    '\nActual:',
    file
  );
});

console.log(
  'Expected:',
  redPath,
  '\nActual:',
  resolve.sync(
    './red',
    {
      basedir: path.join(__dirname, 'style_modules'),
    }
  )
);

```

output:

```
⌘ node example/resolve.js
Expected: /Users/zoubin/usr/src/zoubin/custom-resolve/example/style_modules/red/index.scss
Actual: /Users/zoubin/usr/src/zoubin/custom-resolve/example/style_modules/red/index.scss

Expected: /Users/zoubin/usr/src/zoubin/custom-resolve/example/node_modules/colors/colors.scss
Actual: /Users/zoubin/usr/src/zoubin/custom-resolve/example/node_modules/colors/colors.scss
```

## resolve = resolver(packageEntry, defaultOptions)

### packageEntry

Type: `String`

Default: `main`

If `packageEntry` is `Object`,
then it is treated as `defaultOptions`,
and the package entry is assumed to be specified by `defaultOptions.packageEntry`.

### defaultOptions

Exactly the same `options` used by [node-resolve](https://github.com/substack/node-resolve)
Those values specified in `defaultOptions` will be used as the default value for the options used by `resolve`

Additional options:

#### symlinks

Type: `true`, `Array`, `String`, `RegExp`

If `true`, symlinks will be resolved to their realpaths.

If `Array`, it should contain module directories intended to be realpathified.

```javascript
var resolver = require('..');

var resolve = resolver('style', {
  // Files under `/path/to/node_modules/@app` will be realpathified
  symlinks: ['@app']
});

```

If `String`, it is the same with `[the-string]`.

If `RegExp` or any object with a `test` method, the `test` method will be called with the resolved file, and if `test` returns `true`, the resolved file will be realpathified.

## resolve(id, options, cb)

Type: `Function`

`resolve` has the same signature of [node-resolve](https://github.com/substack/node-resolve)

Some options specified by `defaultOptions` are just overwritten by those from `options`.
However, the others respect some defaulting rules

### option defaulting rules

#### basedir

Type: `String`

directory to begin resolving from

The effective `basedir` is calculated in the following order, stopped when a non-empty value generated:

1. `options.basedir`
2. `path.dirname(options.filename)`
3. `defaultOptions.basedir`
4. `path.dirname(caller())`

`caller()` is the filename where `resolve` is called.

#### extensions

Type: `String`, `Array`

Default: `['.js']`

File extensions to search in order

The effective order:

1. `options.extensions`
2. `defaultOptions.extensions`

#### moduleDirectory

Type: `String`, `Array`

Default: `['node_modules']`

directory (or directories) in which to recursively look for modules.

The effective order:

1. `options.moduleDirectory`
2. `defaultOptions.moduleDirectory`

#### paths

Type: `String`, `Array`

Default: `[]`

require.paths array to use if nothing is found on the normal

The effective order:

1. `options.paths`
2. `defaultOptions.paths`

