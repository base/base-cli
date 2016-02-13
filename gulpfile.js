'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');

var lint = ['index.js'];

gulp.task('coverage', function() {
  return gulp.src(['index.js', 'lib/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['coverage'], function() {
  return gulp.src('test/*.js')
    .pipe(mocha({reporter: 'spec'}))
    .pipe(istanbul.writeReports())
    .pipe(istanbul.writeReports({
      reporters: [ 'text' ],
      reportOpts: {dir: 'coverage', file: 'summary.txt'}
    }));
});

gulp.task('lint', function() {
  return gulp.src(lint.concat('test/*.js'))
    .pipe(eslint())
});

gulp.task('default', ['test', 'lint']);
