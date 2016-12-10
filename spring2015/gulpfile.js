var gulp = require('gulp');
var browserify = require('gulp-browserify');
var watch = require('gulp-watch');

gulp.task('default', function() {
  watch('src/framework/*.js', function() {
    gulp.src('src/framework/*.js')
      .pipe(gulp.dest('./out/framework'));
  });

  watch('src/framework/assets/*.png', function() {
    gulp.src('src/framework/assets/*.png')
      .pipe(gulp.dest('./out/framework/assets/'));
  });

  watch('src/index.htm', function() {
    gulp.src('src/index.htm')
      .pipe(gulp.dest('./out/'));
  });

  gulp.src('src/p2.js')
    .pipe(gulp.dest('./out/'));

  watch(['src/game.js','src/objects/*.js'], function() {
    gulp.src('src/game.js')
      .pipe(browserify({
        insertGlobals: true,
        debug: false
      }))
      .pipe(gulp.dest('./out/'));
  });
});
