
require('babel-register');
var gulp = require('gulp');

require('./gulp/build');
require('./gulp/dev');
require('./gulp/version');

gulp.task('default', ['sass', 'lib', 'html', 'build:dev', 'ionic:start', 'watch']);
gulp.task('test', ['build:dev']);
gulp.task('build:production', ['build:production:compile', 'build:production:apk']);