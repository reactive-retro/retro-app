
const gulp = require('gulp');
const sh = require('shelljs');
const eslint = require('gulp-eslint');

const paths = {
    sass: ['./src/scss/**/*.scss'],
    jade: ['./src/jade/**/*.jade'],
    jsB:  ['./src/js/_init/app.js', './src/js/**/!(app)*.js'],
    js:   ['./src/js/**/*.js']
};

gulp.task('eslint', () => {
    return gulp.src(paths.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('watch', () => {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.jade, ['html']);
    gulp.watch(paths.js, ['build:dev']);
});

gulp.task('ionic:start', (done) => {
    sh.exec('ionic serve -c -l -r --address=retro', { async: true });
    done();
});