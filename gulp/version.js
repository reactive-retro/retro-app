
const fs = require('fs');
const gulp = require('gulp');
const git = require('gulp-git');
const bump = require('gulp-bump');
const filter = require('gulp-filter');
const tagVersion = require('gulp-tag-version');
const runSequence = require('run-sequence');
const changelog = require('gulp-conventional-changelog');
const sh = require('shelljs');
const semver = require('semver');

gulp.task('generate:changelog', () => {
    return gulp.src('CHANGELOG.md')
        .pipe(changelog({
            preset: 'angular',
            releaseCount: 0
        }))
        .pipe(gulp.dest('./'));
});

const versionStream = (type) => {
    const pkg = require('../package.json');
    const oldVer = pkg.version;
    const newVer = semver.inc(oldVer, type);
    const jsonFilter = filter('**/*.json', { restore: true });

    sh.exec('sed -i \'\' -e \'s/version=\"'+ oldVer + '\"/version=\"' + newVer + '\"/\' ./config.xml');

    return gulp.src(['./package.json', './bower.json', './config.xml', './CHANGELOG.md'])
        .pipe(jsonFilter)
        .pipe(bump({version: newVer}))
        .pipe(gulp.dest('./'))
        .pipe(jsonFilter.restore)
        .pipe(git.commit(`chore(version): release ${type} version ${newVer}`))
        .pipe(filter('package.json'))
        .pipe(tagVersion({ prefix: '' }));
};

const pushStream = () => {
    git.push();
    git.push('origin', 'master', { args: '--tags' });
};

gulp.task('bump:patch:tag', ['generate:changelog'], () => versionStream('patch'));
gulp.task('bump:minor:tag', ['generate:changelog'], () => versionStream('minor'));
gulp.task('bump:major:tag', ['generate:changelog'], () => versionStream('major'));

gulp.task('bump:patch', ['generate:changelog'], () => runSequence('bump:patch:tag', () => pushStream()));
gulp.task('bump:minor', ['generate:changelog'], () => runSequence('bump:minor:tag', () => pushStream()));
gulp.task('bump:major', ['generate:changelog'], () => runSequence('bump:major:tag', () => pushStream()));