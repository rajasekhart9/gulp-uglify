'use strict';
var test = require('tape');
var Vinyl = require('vinyl');
var uglifyjs = require('uglify-js');
var gulpUglify = require('../');

var testContentsInput = '"use strict"; (function(console, first, second) {\n\tconsole.log(first + second)\n}(5, 10))';
var testContentsExpected = uglifyjs.minify(testContentsInput, {
  fromString: true,
  compress: false
}).code;

var testFile1 = new Vinyl({
  cwd: '/home/terin/broken-promises/',
  base: '/home/terin/broken-promises/test',
  path: '/home/terin/broken-promises/test/test1.js',
  contents: new Buffer(testContentsInput)
});

test('should not compress files when `compress: false`', function (t) {
  t.plan(7);

  var stream = gulpUglify({
    compress: false
  });

  stream.on('data', function (newFile) {
    t.ok(newFile, 'emits a file');
    t.ok(newFile.path, 'file has a path');
    t.ok(newFile.relative, 'file has relative path information');
    t.ok(newFile.contents, 'file has contents');

    t.ok(newFile instanceof Vinyl, 'file is Vinyl');
    t.ok(newFile.contents instanceof Buffer, 'file contents are a buffer');

    t.equals(String(newFile.contents), testContentsExpected);
  });

  stream.write(testFile1);
  stream.end();
});
