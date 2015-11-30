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

