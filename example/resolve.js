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

