var gulp = require("gulp");
var gutil = require("gulp-util");
var jshint = require("gulp-jshint");
var stylish = require("jshint-stylish");

gulp.task("jshint", function () {
    gulp.src(["app/*.js", "specs/*.js"])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task("default", function () {
    gulp.run("jshint");

    gulp.watch(["app/*.js", "specs/*.js"], function () {
        gulp.run("jshint");
    });
});
