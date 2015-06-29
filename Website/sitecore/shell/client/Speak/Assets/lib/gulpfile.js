var gulp = require('gulp');
var rename = require( 'gulp-rename' );
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('concat', function() {
  gulp.src([
  'core/1.2/deps/handlebars-v1.3.0.js',
  'core/1.2/sitecore.js',
  'ui/1.2/deps/knockout-3.0.0.js',
  'ui/1.2/deps/jquery-2.1.1.js',
  'ui/1.2/deps/underscore.1.6.0.js',
  'ui/1.2/deps/backbone.1.1.1.js',
  'ui/1.2/deps/bootsrap.js'
  ])
	.pipe( concat( 'sitecore.packed.js' ) )
    .pipe(gulp.dest('core/1.2/'))
});

gulp.task('compress', ['concat'], function () {
  gulp.src(['core/1.2/sitecore.packed.js'])
    .pipe(uglify())
    .pipe(rename('sitecore.packed.min.js'))
    .pipe(gulp.dest('core/1.2/'))
});


gulp.task('default', ["compress"]);