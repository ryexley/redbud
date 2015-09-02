var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable("event_log", {
    ifNotExists: true,
    columns: {
      id: { type: "serial", primaryKey: true },
      app: { type: "string", length: 50, notNull: true },
      data: { type: "jsonb", notNull: true },
      created: { type: "timestamp", notNull: true, defaultValue: /* jshint -W053 */ new String("(current_timestamp at time zone 'utc')") /* jshint +W053 */ }
    }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable("event_log", callback);
};
