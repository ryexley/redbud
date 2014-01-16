var gulp = require("gulp");
var gutil = require("gulp-util");
var jshint = require("gulp-jshint");
var stylish = require("jshint-stylish");
var stylus = require("gulp-stylus");

gulp.task("jshint", function () {
    gulp.src(["app/**/*.js", "specs/**/*.js", "sample/**/*.js"])
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter(stylish));
});

gulp.task("sample-stylus", function () {
    gulp.src("stylus/sample.styl")
        .pipe(stylus({ set: ["compress"] }))
        .pipe(gulp.dest("sample/public/css"));
});

gulp.task("default", function () {
    gulp.run("jshint", "sample-stylus");

    gulp.watch(["app/**/*.js", "specs/**/*.js", "sample/**/*.js"], function () {
        gulp.run("jshint");
    });

    gulp.watch("stylus/sample.styl", function () {
        gulp.run("sample-stylus");
    });
});
