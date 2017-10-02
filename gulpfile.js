var gulp            = require('gulp');
var shell           = require('gulp-shell');
var cp              = require('child_process');
var browserSync     = require('browser-sync');
var plumber         = require('gulp-plumber');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var cssnano         = require('gulp-cssnano');
var rename          = require('gulp-rename');
var order           = require('gulp-order');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var sourcemaps      = require('gulp-sourcemaps');

gulp.task('build', function (done) {
  browserSync.notify('Building Jekyll');
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
  .on('close', done);
});

gulp.task('rebuild', ['build'], function () {
  browserSync.reload();
});

gulp.task('sync', ['build'], function() {
  browserSync.init({
    server: {
      baseDir: '_site'
    },
    host: "localhost"
  });
});

gulp.task('styles', function(){
  gulp.src('assets/css/src/bolt.scss')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(cssnano())
  .pipe(rename('bolt.min.css'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('assets/css/dist'))
  .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  gulp.src(['assets/js/src/**/*.js'])
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(order([
    'assets/js/src/plugins/**/*.js',
    'assets/js/src/bolt.js'
  ], { base: './' }))
  .pipe(concat('bolt.min.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('assets/js/dist/'))
  .pipe(browserSync.stream());
});

gulp.task('watch', function(){
  gulp.watch('assets/js/src/**/*.js', ['scripts', 'rebuild']);
  gulp.watch('assets/css/src/**/*.scss', ['styles', 'rebuild']);
  gulp.watch(['*.html', '_includes/*.html', '_layouts/*.html', '*.md', '_posts/*', '_pages/*'], ['rebuild']);
})

gulp.task('default', ['sync', 'styles', 'scripts', 'watch'])
