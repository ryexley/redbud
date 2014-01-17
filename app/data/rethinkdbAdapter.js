var assert = require("assert");
var logDebug = require("debug")("rdb:debug");
var logError = require("debug")("rdb:error");
var r = require("rethinkdb");

module.exports = function (config) {

    var dbHost = config.database.host;
    var dbPort = config.database.port;
    var dbName = config.database.name;

    var adapter = {
        connectionData: {
            host: dbHost,
            port: dbPort
        },

        setup: function () {
            var createTable = function (cnx, name) {
                r.db(dbName).tableCreate(name, { primaryKey: config.database.tables[name] }).run(cnx, function (err, result) {
                    if (err) {
                        logDebug("[DEBUG] RethinkDB table '%s' already exist in database '%s' (%s:%s\n%s)", name, dbName, err.name, err.msg, err.message);
                    } else {
                        logDebug("[INFO] RethinkDB table '%s' created in database '%s'", name, config.database.name);
                    }
                });
            };

            r.connect({ host: dbHost, port: dbPort }, function (cnErr, cnx) {
                assert.ok(cnErr === null, cnErr);
                r.dbCreate(dbName).run(cnx, function (err, result) {
                    if (err) {
                        logDebug("[DEBUG] RethinkDB database '%s' already exists (%s:%s)\n%s", dbName, err.name, err.msg, err.message);
                    } else {
                        logDebug("[INFO] RethinkDB database '%s' created", config.database.name);
                    }
                });

                for (var table in config.database.tables) {
                    createTable(cnx, table);
                }
            });
        },

        connect: function (done) {
            r.connect(this.connectionData, function (err, cnx) {
                assert.ok(err === null, err);
                cnx._id = Math.floor(Math.random() * 10001);
                done(err, cnx);
            });
        },

        saveTrackingData: function (data, done) {
            this.connect(function (err, cnx) {
                r.db(dbName).table("tracking_data").insert(data).run(cnx, function (err, result) {
                    if (err) {
                        logError("[ERROR][%s][saveTrackingData] %s:%s\n%s", cnx._id, err.name, err.msg, err.message);
                    } else {
                        if (result.inserted === 1) {
                            done(null, true);
                        } else {
                            done(null, false);
                        }
                    }

                    cnx.close();
                });
            });
        }
    };

    return adapter;

};
