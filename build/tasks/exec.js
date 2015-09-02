import path from "path";
import _template from "lodash/string/template";
import _extend from "lodash/object/assign";
import gulp from "gulp";
import minimist from "minimist";
import shell from "shelljs";

const env = process.env.NODE_ENV || "dev";
const argdefs = { string: "name" };
const root = path.join(__dirname, "../../");
const migrationBin = path.join(root, "node_modules/db-migrate/bin/db-migrate");
const migrationDir = path.join(root, "src/db/migrations");
const migrationConfig = _template("${dir}/${env}.database.json")({ dir: migrationDir, env: env });

const createMigrationCommand = "node ${bin} create ${name} --env ${env} --migrations-dir ${dir} --config ${config}";
const migrateUpCommand = "node ${bin} up --env ${env} --migrations-dir ${dir} --config ${config}";
const migrateDownCommand = "node ${bin} down --env ${env} --migrations-dir ${dir} --config ${config}";

let migrationOptions = {
  env: env,
  bin: migrationBin,
  dir: migrationDir,
  config: migrationConfig
};

let args = minimist(process.argv.slice(1), argdefs);

gulp.task("db:migration:create", function (next) {
  let options = _extend(migrationOptions, { name: args.name }),
      command = _template(createMigrationCommand)(options);

  shell.exec(command, () => { next(); });
});

gulp.task("db:migrate:up", (next) => {
  let command = _template(migrateUpCommand)(migrationOptions);

  shell.exec(command, () => { next(); });
});

gulp.task("db:migrate:down", (next) => {
  let command = _template(migrateDownCommand)(migrationOptions);

  shell.exec(command, () => { next(); });
});
