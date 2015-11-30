var resolver = require('..')
var test = require('tap').test
var path = require('path')
var fixtures = path.resolve.bind(path, __dirname, 'fixtures')

test('symlink', function(t) {
  t.plan(3)

  var opts = { basedir: fixtures('local_modules') }

  var resolve = resolver({ symlink: 'symlink_module' })
  resolve('symlink_module', opts, function (err, file) {
    t.equal(
      file,
      fixtures('symlink_module', 'index.js'),
      'array'
    )
  })

  resolve = resolver({ symlink: true })
  t.equal(
    resolve.sync('symlink_module', opts),
    fixtures('symlink_module', 'index.js'),
    'true'
  )

  resolve = resolver({
    symlink: function () {
      return true
    },
  })
  t.equal(
    resolve.sync('symlink_module', opts),
    fixtures('symlink_module', 'index.js'),
    'true'
  )
})

