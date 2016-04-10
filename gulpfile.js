
require('babel-register');
var gulp = require('gulp');
var runSequence = require('run-sequence');

require('./gulp/build');
require('./gulp/dev');
require('./gulp/version');

gulp.task('default', (done) => {
    runSequence(['sass', 'lib', 'html', 'copy:assets', 'build:dev'], 'ionic:start', 'watch');
    done();
});
gulp.task('test', ['build:dev']);
gulp.task('build:production', ['build:production:compile', 'build:production:apk']);