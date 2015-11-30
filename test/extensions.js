var resolver = require('..')
var test = require('tap').test
var path = require('path')
var fixtures = path.resolve.bind(path, __dirname, 'fixtures')

test('extensions, default', function(t) {
  var resolve = resolver()

  t.equal(
    resolve.sync('../default/index.css', {
      basedir: fixtures('local_modules', 'style'),
    }),
    fixtures('local_modules', 'default', 'index.css'),
    'lookup with extension'
  )

  t.end()
})

test('extensions, custom', function(t) {
  var resolve = resolver({ extensions: '.css' })

  t.equal(
    resolve.sync('../default', {
      basedir: fixtures('local_modules', 'style'),
    }),
    fixtures('local_modules', 'default', 'index.css'),
    'custom extensions'
  )

  t.end()
})

