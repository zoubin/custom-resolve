var resolver = require('..')
var test = require('tap').test
var path = require('path')
var fixtures = path.resolve.bind(path, __dirname, 'fixtures')

test('filename', function(t) {
  t.plan(2)
  var resolve = resolver()
  var expected = fixtures('symlink_module', 'index.js')
  var fakeFile = fixtures('symlink_module', 'fake.js')
  resolve('./index', { filename: fakeFile }, function (err, res) {
    t.equal(res, expected, 'async')
  })
  t.equal(
    resolve.sync('./index', { filename: fakeFile }),
    expected,
    'sync'
  )
})

