var gulp    = require('gulp'),
	gutil   = require('gulp-util'),
	uglify  = require('gulp-uglifyjs'),
	concat  = require('gulp-concat');

gulp.task('browser', function () {
    gulp.src(['main.js'])
        .pipe(uglify({
        	mangle: true,
            compress: true,
        	enclose: true
        }))
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('mobile', function () {
    gulp.src(['m/js/mobile.js'])
        .pipe(uglify({
            mangle: true,
            compress: true,
            enclose: true
        }))
        .pipe(concat('mobile.min.js'))
        .pipe(gulp.dest('m/dist/js'));
});

gulp.task('default', function(){
    gulp.watch('*.js', ['browser']);
    gulp.watch('m/js/*.js', ['mobile']);
});
