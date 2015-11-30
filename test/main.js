var resolver = require('..')
var test = require('tap').test
var path = require('path')
var fixtures = path.resolve.bind(path, __dirname, 'fixtures')

test('main', function(t) {
  t.plan(2)
  var resolve = resolver('style')
  var expected = fixtures('local_modules', 'style', 'style.css')
  resolve('./style', { basedir: fixtures('local_modules') }, function (err, res) {
    t.equal(res, expected, 'async')
  })
  t.equal(
    resolve.sync('./style', { basedir: fixtures('local_modules') }),
    expected,
    'sync'
  )
})

