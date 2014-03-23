var gulp = require('gulp');

var browserSync = require('browser-sync');
var w3cjs = require('gulp-w3cjs');
var compass = require('gulp-compass');
var notify = require("gulp-notify");
var es = require('event-stream');
var plumber = require('gulp-plumber');
var failed = false;

gulp.task('browser-sync', function() {  
    return browserSync.init(["app/css/*.css", "app/js/*.js", "app/*.html"], {
        server: {
            baseDir: "app/"
        }
    });
});

gulp.task('w3cjs', function () {
     gulp.src('app/index.html')
     .pipe(w3cjs())
		.pipe(es.map(function (file, cb) {
			cb(null, file);
			
				failed = !file.w3cjs.success;
		}))
		
		.on('end', function () {
			if (failed) {
				gulp.src('').pipe(notify({ message : 'Probleme dans l\'HTML'}));
			}
		});

});

gulp.task('compass', function () {  
    return gulp.src('app/scss/style.scss')
    	.pipe(plumber())
        .pipe(compass({css : 'app/css',sass : 'app/scss'}))
        .pipe(gulp.dest('app/css'));
});

// default gulp task
gulp.task('default', ['compass', 'browser-sync', 'w3cjs'], function () {  
    gulp.watch("app/scss/*.scss", ['compass']);
    gulp.watch("app/index.html", ['w3cjs']);
});
