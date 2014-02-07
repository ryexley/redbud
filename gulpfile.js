var gulp = require("gulp");
var gutil = require("gulp-util");
var jshint = require("gulp-jshint");
var stylish = require("jshint-stylish");
var stylus = require("gulp-stylus");
var rename = require("gulp-rename");

gulp.task("jshint", function () {
    gulp.src(["app/**/*.js", "specs/**/*.js", "sample/**/*.js"])
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter(stylish));
});

gulp.task("copy-normalize-css", function (next) {
    gulp.src("app/public/bower-components/normalize-css/normalize.css")
        .pipe(rename("normalize.styl"))
        .pipe(gulp.dest("stylus"));

    next();
});

gulp.task("client-stylus", ["copy-normalize-css"], function () {
    gulp.src("stylus/redbud.styl")
        .pipe(stylus({ set: ["compress"] }))
        .pipe(gulp.dest("app/public/css"));
});

gulp.task("sample-stylus", function () {
    gulp.src("stylus/sample.styl")
        .pipe(stylus({ set: ["compress"] }))
        .pipe(gulp.dest("sample/public/css"));
});

gulp.task("watch", function () {
    gulp.watch(["app/**/*.js", "specs/**/*.js", "sample/**/*.js"], ["jshint"]);
    gulp.watch("stylus/sample.styl", ["sample-stylus"]);
    gulp.watch("stylus/redbud.styl", ["client-stylus"]);
});

gulp.task("default", ["jshint", "sample-stylus", "client-stylus", "watch"]);
