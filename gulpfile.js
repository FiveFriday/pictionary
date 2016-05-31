var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var del  = require('del');
var jsonfile = require('jsonfile');

var sassPaths = [
  'app/lib/foundation-sites/scss',
  'app/lib/motion-ui/src'
];

var distPath = 'public/';

//read the image foundation-global-styles
var file = 'app/images.json';

gulp.task('sass', ['clean-dist'], function() {
  return gulp.src('app/scss/style.scss')
    .pipe($.sass({
      includePaths: sassPaths
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('app/css'));
});

gulp.task('clean-dist', function (cb) {
  return del([
    distPath
  ], cb);
});

gulp.task('compress', ['sass'], function() {
  return gulp.src(['app/app.js'])
    // .pipe($.sourcemaps.init())
    .pipe($.concat('app.min.js'))
    .pipe($.uglify({mangle:false}))
    // .pipe($.sourcemaps.write())
    .pipe(gulp.dest('app/js/'));
});

gulp.task('build-index', ['compress'], function () {
  jsonfile.readFile(file, function(err, obj) {
    // console.log(JSON.stringify(obj));
    return gulp.src('app/index.pug')
        .pipe($.pug({
          locals:
            {
              pics: obj,
            },
            pretty:  true
          }))
        .pipe($.rename({
          basename: 'index',
          extname: '.html'
        }))
        .pipe(gulp.dest(distPath));
  });
});


gulp.task('compress-images', ['build-index'], function() {
  return gulp.src(['app/img/**'])
    .pipe($.imagemin())
    .pipe(gulp.dest(distPath + 'img/'));
});


gulp.task('copy-front', ['compress-images'], function(){
  return gulp.src(['app/**', '!app/scss', '!app/scss/**', '!app/includes', '!app/**/*.pug', '!app/img/**', '!app/*.json'], { dot: true })
    .pipe(gulp.dest(distPath));
});

//watch function
gulp.task('watch', function(){
  // gulp.watch('./app/scss/*.scss', ['default']);
  gulp.watch('./app/**', ['default']);
});

gulp.task('default', ['copy-front'] , function() {
  // place code for your default task here
});
