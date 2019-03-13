'use strict';

// This gulp file automatically compiles the scss to css

var gulp      = require('gulp');
var sass      = require('gulp-sass');
var minifyCSS = require('gulp-clean-css');
var uglify    = require('gulp-uglify');
var rename    = require('gulp-rename');
var changed   = require('gulp-changed');

var SCSS_SRC  = './src/assets/scss/**/*.scss';
var SCSS_DEST = './src/assets/css';

const compile = gulp.series(() => {
  return gulp.src(SCSS_SRC)
  .pipe(sass().on('error', sass.logError))
  .pipe(minifyCSS())
  .pipe(rename({ suffix: '.min' }))
  .pipe(changed(SCSS_DEST))
  .pipe(gulp.dest(SCSS_DEST))
});

const watch_scss = gulp.series(() => {
  gulp.watch(SCSS_SRC, compile);
});

exports.watch = watch_scss;
exports.compile = compile;

// exports.default = gulp.series(watch_scss, compile);
