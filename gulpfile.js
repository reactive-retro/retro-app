var bower = require('bower');

var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var jade = require('gulp-jade');
var eslint = require('gulp-eslint');
var ngAnnotate = require('gulp-ng-annotate');

var sh = require('shelljs');

var paths = {
    sass: ['./src/scss/**/*.scss'],
    jade: ['./src/jade/**/*.jade'],
    jsB:  ['./src/js/_init/app.js', './src/js/**/!(app)*.js'],
    js:   ['./src/js/**/*.js']
};

var lib = [
    './www/lib/lodash/lodash.js',
    './www/lib/dice.js/build/dice.js',
    './www/lib/ionic/release/js/ionic.bundle.js',
    './www/lib/ngCordova/dist/ng-cordova.js',
    './www/lib/auth0-angular/build/auth0-angular.js',
    './www/lib/ngstorage/ngStorage.js',
    './www/lib/socketcluster-client/socketcluster.js',
    './www/lib/ng-cordova-oauth/ng-cordova-oauth.js',
    './www/lib/angular-jwt/dist/angular-jwt.js',
    './www/lib/auth0-lock/build/auth0-lock.js'
];

gulp.task('default', ['sass', 'lib', 'html', 'build', 'ionic:start', 'watch']);
gulp.task('test', ['build']);

gulp.task('sass', function(done) {
    gulp.src('./src/scss/ionic.app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.jade, ['html']);
    gulp.watch(paths.js, ['build']);
});

gulp.task('lib', function() {
    gulp.src(lib)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./www/js'));
});

gulp.task('html', function() {
    gulp.src(paths.jade)
        .pipe(jade())
        .pipe(concat('index.html'))
        .pipe(gulp.dest('./www/'));
});

gulp.task('eslint', function() {
    return gulp.src(paths.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('build', ['eslint'], function() {
    gulp.src(paths.jsB)
        .pipe(babel())
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./www/js'));
});

gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('ionic:start', function(done) {
    sh.exec('ionic serve -c -l -r --address=retro', { async: true });
    done();
});

gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
