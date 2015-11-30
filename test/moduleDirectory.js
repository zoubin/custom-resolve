var resolver = require('..')
var test = require('tap').test
var path = require('path')
var fixtures = path.resolve.bind(path, __dirname, 'fixtures')

test('moduleDirectory, default', function(t) {
  t.plan(2)

  var resolve = resolver({
    extensions: '.scss',
    main: 'style',
  })

  var expected = fixtures('node_modules', 'style', 'style.scss')
  var opts = {
    basedir: fixtures('local_modules', 'default'),
  }

  resolve('style', opts, function (err, res) {
    t.equal(res, expected, 'async')
  })

  t.equal(resolve.sync('style', opts), expected, 'sync')

})

test('moduleDirectory, custom', function(t) {
  t.plan(2)

  var resolve = resolver({
    extensions: '.scss',
    moduleDirectory: 'web_modules',
    main: 'style',
  })

  var expected = fixtures('web_modules', 'default', 'index.scss')
  var opts = {
    basedir: fixtures('local_modules', 'default'),
  }

  resolve('default', opts, function (err, res) {
    t.equal(res, expected, 'async')
  })

  t.equal(resolve.sync('default', opts), expected, 'sync')

})

