var resolver = require('..')
var test = require('tap').test
var path = require('path')
var fixtures = path.resolve.bind(path, __dirname, 'fixtures')

test('basedir', function(t) {
  t.plan(2)
  var resolve = resolver({ basedir: fixtures('symlink_module') })
  var expected = fixtures('symlink_module', 'index.js')
  resolve('./index', function (err, res) {
    t.equal(res, expected, 'async')
  })
  t.equal(resolve.sync('./index'), expected, 'sync')
})

