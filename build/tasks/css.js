import path from "path";
import gulp from "gulp";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer-core";
import cssnext from "cssnext";
import imports from "postcss-import";
import nested from "postcss-nested";
import variables from "postcss-simple-vars";
import mixins from "postcss-mixins";
import csswring from "csswring";
import config from "../config";

const processors = [
  autoprefixer({ browsers: ["last 2 version"]}),
  imports({ path: path.join(config.paths.src, "css"), glob: true }),
  cssnext(),
  mixins,
  nested,
  variables(),
  csswring()
];

gulp.task("css:app", ["clean:app:css"], () => {

  gulp.src(path.join(config.paths.src, "css/app/main.css"))
      .pipe(postcss(processors))
      .pipe(gulp.dest(path.join(config.paths.server, "public/css")));

});

gulp.task("css:sample", ["clean:sample:css"], () => {

  gulp.src(path.join(config.paths.src, "css/sample/main.css"))
      .pipe(postcss(processors))
      .pipe(gulp.dest(path.join(config.paths.sample, "public/css")));

});
