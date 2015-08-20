import path from "path";
import gulp from "gulp";
import del from "del";
import config from "../config";

gulp.task("clean:app:css", (next) => {
  del([path.join(config.paths.server, "public/css/**/*.css")], next);
});

gulp.task("clean:sample:css", (next) => {
  del([path.join(config.paths.sample, "public/css/**/*.css")], next);
});
