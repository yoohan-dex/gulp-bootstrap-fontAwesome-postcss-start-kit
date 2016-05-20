

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
  notify = require('gulp-notify'),
   bower = require('gulp-bower');

var postcss = require('gulp-postcss');

var autoprefixer = require('autoprefixer');
var scss = require('postcss-scss');
var cssnext = require('postcss-cssnext');
var nested = require('postcss-nested');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var config = {
  sassPath: './resources/sass',
  bowerDir: './bower_components'
}
var processors = [
  nested,
  autoprefixer({ browsers: ['last 10 version'] }),

];
gulp.task('bower', () => {
  return bower()
    .pipe(gulp.dest(config.bowerDir))
})
gulp.task('icons', () => {
  return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
    .pipe(gulp.dest('./public/fonts'))
})

gulp.task('css', () => {
  return gulp.src(config.sassPath + '/style.scss')
    .pipe(sass({
      style: 'compressed',
      loadPath: [
        './resources/sass',
        config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
        config.bowerDir + '/fontawesome/scss',
      ]
    })
      .on('error', notify.onError(() => {
        return 'Error:' + error.message;
      }))
    )
    .pipe(gulp.dest('./public/css'))
});

gulp.task('postcss', () => {
  return gulp.src('./public/css/style.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./public/css'))
    .pipe(reload({ stream: true }))
})

gulp.task('watch', () => {
  gulp.watch(config.sassPath + '/**/*.scss', ['css']);
  gulp.watch('./public/*.html', reload);
})

gulp.task('serve', ['bower', 'icons', 'css','postcss', 'watch'], function () {
  browserSync.init({
    open: true,
    port: 8080,
    server: {
      baseDir: "./public",
      directory: true,
    }
  });
})

gulp.task('default', ['serve']);