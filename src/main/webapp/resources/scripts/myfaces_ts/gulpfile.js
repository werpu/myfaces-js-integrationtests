var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("ts/tsconfig.json");
var browserify = require('gulp-browserify');
var runSequence = require('run-sequence');

gulp.task("ts", function () {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest("js"));
});

// Basic usage
gulp.task('scripts', function() {
    // Single entry point to browserify
    gulp.src('js/api/jsf.js')
        .pipe(browserify({
            insertGlobals : true//,
            //debug : !gulp.env.production
        }))
        .pipe(gulp.dest('js'))

});

gulp.task('default',
    function(cb) {
        runSequence('ts', 'scripts', cb);
    });