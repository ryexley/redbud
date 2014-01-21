var r = require("rethinkdb");
var _ = require("lodash");
var assert = require("assert");
var colors = require("colors");
var async = require("async");

/*
    This is the main abstraction, which tweaks the RethinkDb Table prototype to be a bit
    less verbose - favoring direct method calls over fluent interface.

    The table returned from this constructor is a RethinkDB table, with methods like
    "save" and destroy attached to it.
*/
var Table = function (config, tableName) {

    var table = r.db(config.db).table(tableName);

    //give it some abilities yo
    table.first = function (criteria, next) {
        table.query(criteria, function(err, array) {
            next(err, _.first(array));
        });
    };

    table.exists = function (criteria, next) {
        onConnect(function(err, conn) {
            assert.ok(err === null, err);
            table.query(criteria, function(err, result) {
                assert.ok(err === null, err);
                conn.close();
                next(null, result.length > 0);
            });
        });
    };

    table.query = function (criteria, next) {
        onConnect(function(err, conn) {
            assert.ok(err === null, err);
            table.filter(criteria).run(conn, function(err, result) {
                assert.ok(err === null, err);
                conn.close();
                result.toArray(next);
            });
        });
    };

    table.save = function (thing, next) {
        onConnect(function(err, conn) {
            assert.ok(err === null, err);
            table.insert(thing, {
                upsert: true
            }).run(conn, function(err, result) {
                assert.ok(err === null, err);
                if (result.generated_keys && result.generated_keys.length > 0) {
                    thing.id = _.first(result.generated_keys);
                }
                conn.close();
                next(err, thing);
            });
        });
    };

    table.updateOnly = function (updates, id, next) {
        onConnect(function(err, conn) {
            assert.ok(err === null, err);
            table.get(id).update(updates).run(conn, function(err, result) {
                assert.ok(err === null, err);
                conn.close();
                next(null, result.replaced > 0);
            });
        });
    };

    table.destroyAll = function (next) {
        onConnect(function(err, conn) {
            assert.ok(err === null, err);
            table.delete().run(conn, function(err, result) {
                assert.ok(err === null, err);
                conn.close();
                next(err, result.deleted);
            });
        });
    };

    table.destroy = function (id, next) {
        onConnect(function(err, conn) {
            assert.ok(err === null, err);
            table.get(id).delete().run(conn, function(err, result) {
                assert.ok(err === null, err);
                conn.close();
                next(err, true);
            });
        });
    };

    table.index = function (att, next) {
        onConnect(function(err, conn) {
            assert.ok(err === null, err);
            table.indexCreate(att).run(conn, function(err, result) {
                assert.ok(err === null, err);
                conn.close();
                next(err, result.created == 1);
            });
        });
    };

    //stole this from https://github.com/rethinkdb/rethinkdb-example-nodejs-chat/blob/master/lib/db.js
    var onConnect = function (callback) {
        r.connect(config, function(err, conn) {
            assert.ok(err === null, err);
            conn['_id'] = Math.floor(Math.random() * 10001);
            callback(err, conn);
        });
    };

    return table;

};

var SecondThought = function (config) {

    var self = this;
    var connection = {};

    assert.ok(config, "No database configuration provided");

    config = {
        host: config.host || "localhost",
        db: config.name,
        port: config.port || 28015,
        tables: config.tables || []
    };

    /*
        The first method to call in order to use the API.
        The connection information for the DB. This should have {host, db, port}; host and port are optional.
    */
    self.connect = function (args, next) {
        // setConfig(args);
        //get a list of tables and loop them
        r.connect(config, function(err, conn) {
            assert.ok(err === null, err);
            r.tableList().run(conn, function(err, tables) {
                if (!err) {
                    //enumerate the tables and drop them onto this object
                    _.each(tables, function(table) {
                        self[table] = new Table(config, table);
                    });
                }
                next(err, self);
            });
        });
    };

    self.openConnection = function (next) {
        r.connect(config, next);
    };

    self.createDb = function (dbName, next) {

        r.connect({
            host: config.host,
            port: config.port
        }, function(err, conn) {
            assert.ok(err === null, err);
            r.dbCreate(dbName).run(conn, function(err, result) {
                //assert.ok(err === null,err);
                conn.close();
                next(err, result);
            });
        });
    };

    self.dropDb = function (dbName, next) {

        r.connect({
            host: config.host,
            port: config.port
        }, function(err, conn) {
            assert.ok(err === null, err);
            r.dbDrop(dbName).run(conn, function(err, result) {
                conn.close();
                next(err, result);
            });
        });
    };


    self.createTable = function (table, next) {

        r.connect(config, function(err, conn) {
            assert.ok(err === null, err);
            self.tableExists(table.name, function (err, exists) {
                var create = false;
                if (!exists) {
                    create = true;
                } else {
                    if (table.overwrite) {
                        create = true;
                    } else {
                        console.log("\t=> Table `" + table.name + "` already exists in database `" + config.db + "`");
                    }
                }

                if (create) {
                    r.tableCreate(table.name, { primaryKey: table.key || "id" }).run(conn, function (err, result) {
                        assert.ok(err === null, err);
                        console.log("\t=> Table `" + table.name + "` created successfully in database `" + config.db + "`");
                        conn.close();
                        next();
                    });
                }
            });

            // r.tableCreate(tableName).run(conn, function(err, result) {
            //     assert.ok(err === null, err);
            //     conn.close();
            //     next();
            // });
        });
    };

    self.tableExists = function (tableName, next) {

        r.connect(config, function(err, conn) {
            assert.ok(err === null, err);
            r.tableList().run(conn, function(err, tables) {
                assert.ok(err === null, err);
                conn.close();
                next(null, _.contains(tables, tableName));
            });
        });
    };

    self.dbExists = function (dbName, next) {

        r.connect(config, function(err, conn) {
            assert.ok(err === null, err);
            r.dbList().run(conn, function(err, dbs) {
                assert.ok(err === null, err);
                conn.close();
                next(null, _.contains(dbs, dbName));
            });
        });
    };

    self.install = function (tables, next) {
        assert.ok(tables);
        console.log("\t=> Creating database `" + config.db + "`");
        self.createDb(config.db, function(err, result) {
            console.log("\t=> Database `" + config.db + "` created successfully");
            async.each(tables, self.createTable, function(err) {
                assert.ok(err === null, err);
                next(err, err === null);
            });
        });
    };

    self.setup = function () {
        self.connect({ host: config.host, db: config.name, port: config.port }, function (err, db) {
            console.log("Running database setup...");
            self.install(config.tables, function (err, result) {
                assert(err === null, err);
                console.log("!!!!!!!!!!! Database `setup` completed successfully");
            });
        });
    };

    return self;
};

module.exports = function (config) {
    return new SecondThought(config);
};
