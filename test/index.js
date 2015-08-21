var resolver = require('..');
var test = require('tap').test;
var path = require('path');
var fixtures = path.resolve.bind(path, __dirname, 'fixtures');

test('local_modules', function(t) {
  t.plan(2);
  var resolve = resolver('style', { extensions: '.css' });
  resolve(
    './default',
    { basedir: fixtures('local_modules') },
    function (err, res) {
      t.equal(
        res,
        fixtures('local_modules', 'default', 'index.css'),
        'local_modules, defaults to index.css'
      );
    }
  );
  resolve(
    './style',
    { basedir: fixtures('local_modules') },
    function (err, res) {
      t.equal(
        res,
        fixtures('local_modules', 'style', 'style.css'),
        'local_modules, uses style field in package.json'
      );
    }
  );
});

test('caller', function(t) {
  var resolve = resolver('style');
  t.equal(
    resolve.sync('./' + path.basename(__filename)),
    __filename,
    "should use the caller's filename if neither of `basedir` and `filename` set "
  );
  t.end();
});

test('.filename', function(t) {
  var resolve = resolver('style', { extensions: '.scss' });

  t.equal(
    resolve.sync(
      'style',
      { filename: fixtures('fake.js') }
    ),
    fixtures('node_modules', 'style', 'style.scss'),
    'node_modules, should respect the filename filed'
  );
  t.end();
});

test('moduleDirectory', function(t) {
  var resolve = resolver('style', { extensions: '.scss' });

  t.equal(
    resolve.sync(
      'default',
      {
        basedir: fixtures(),
        moduleDirectory: 'web_modules',
      }
    ),
    fixtures('web_modules', 'default', 'index.scss'),
    'should concat, new'
  );
  t.equal(
    resolve.sync(
      'style',
      {
        basedir: fixtures(),
        moduleDirectory: 'web_modules',
      }
    ),
    fixtures('node_modules', 'style', 'style.scss'),
    'should concat, default'
  );
  t.end();
});

test('paths', function(t) {
  var resolve = resolver('style', {
    extensions: ['.css', '.scss'],
    paths: fixtures('node_modules'),
  });

  t.equal(
    resolve.sync(
      'default',
      {
        basedir: fixtures(),
        paths: fixtures('web_modules'),
      }
    ),
    fixtures('web_modules', 'default', 'index.scss'),
    'should concat, new'
  );
  t.equal(
    resolve.sync(
      'style',
      {
        basedir: fixtures(),
        paths: fixtures('web_modules'),
      }
    ),
    fixtures('node_modules', 'style', 'style.scss'),
    'should concat, default'
  );
  t.end();
});

test('extensions', function(t) {
  var resolve = resolver('style', {
    extensions: '.css',
    moduleDirectory: ['web_modules', 'node_modules'],
  });

  t.equal(
    resolve.sync(
      'default',
      {
        basedir: fixtures(),
        extensions: '.scss',
      }
    ),
    fixtures('web_modules', 'default', 'index.scss'),
    'should concat, new'
  );
  t.equal(
    resolve.sync(
      './style',
      {
        basedir: fixtures('local_modules'),
        extensions: '.scss',
      }
    ),
    fixtures('local_modules', 'style', 'style.css'),
    'should concat, default'
  );
  t.end();
});

test('symlink', function(t) {
  t.plan(2);

  var resolve = resolver({ symlinks: true });
  resolve('symlink_module', { basedir: fixtures() }, function (err, file) {
    t.equal(
      file,
      fixtures('symlink_module', 'index.js'),
      'async'
    );
  });
  t.equal(
    resolve.sync('symlink_module', { basedir: fixtures() }),
    fixtures('symlink_module', 'index.js'),
    'sync'
  );
});

