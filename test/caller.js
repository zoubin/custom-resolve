var resolver = require('..')
var test = require('tap').test
var path = require('path')

test('caller', function(t) {
  t.plan(2)
  var resolve = resolver('style')
  resolve('./' + path.basename(__filename), function (err, res) {
    t.equal(res, __filename, 'async')
  })
  t.equal(
    resolve.sync('./' + path.basename(__filename)),
    __filename,
    'sync'
  )
})

