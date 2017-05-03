var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require("gulp-sourcemaps");


gulp.task('khoaijs-app', function () {
    return gulp.src('app.js')
        .pipe(sourcemaps.init())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
});


gulp.task('default', ['khoaijs-app']);