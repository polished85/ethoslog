'use strict'
 
const gulp = require('gulp')
const sass = require('gulp-sass')
 
gulp.task('sass', function () {
  return gulp.src('./styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('../static/css/'))
})
 
gulp.task('sass:watch', function () {
  gulp.watch('./**/*.scss', ['sass'])
})
