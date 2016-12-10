var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify');

gulp.task('default', function() {

  gulp.src('./src/libs/**/*.js')
    .pipe(gulp.dest('./out/libs/'));

  gulp.src('./src/*.html')
    .pipe(gulp.dest('./out/'));

  gulp.src('./src/coffeescripts/**/*.coffee')
    .pipe(coffee())
    .pipe(gulp.dest('./out/js'));

  gulp.src('./out/js/engine.js', {read: false})
    .pipe(browserify())
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest("./out"));

  // gulp.src('./src/coffeescripts/engine.coffee', {read: false })
  //   .pipe(browserify({ transform: ['coffeeify'], extensions: ['.coffee'] }))
  //   .pipe(concat('bundle.js'))
  //   .pipe(gulp.dest('./out/js'));

});
