import gulp from "gulp";

gulp.task("default", ["css"]);
gulp.task("css", ["css:app", "css:sample"]);
