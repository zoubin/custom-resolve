var resolver = require('..')
var test = require('tap').test
var path = require('path')
var fixtures = path.resolve.bind(path, __dirname, 'fixtures')

test('moduleDirectory, default', function(t) {
  var resolve = resolver('style', { extensions: '.scss' })

  t.equal(
    resolve.sync('style', {
      basedir: fixtures('local_modules', 'default'),
    }),
    fixtures('node_modules', 'style', 'style.scss')
  )

  t.end()
})

test('moduleDirectory, custom', function(t) {
  var resolve = resolver('style', {
    extensions: '.scss',
    moduleDirectory: 'web_modules',
  })

  t.equal(
    resolve.sync('default', {
      basedir: fixtures('local_modules', 'default'),
    }),
    fixtures('web_modules', 'default', 'index.scss')
  )

  t.end()
})

