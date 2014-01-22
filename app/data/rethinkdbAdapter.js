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

/* https://github.com/robconery/second-thought */
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
                        console.log("\t=> Table `".grey + table.name + "` already exists in database `".grey + config.db + "`".grey);
                    }
                }

                if (create) {
                    r.tableCreate(table.name, { primaryKey: table.key || "id" }).run(conn, function (err, result) {
                        assert.ok(err === null, err);
                        console.log("\t=> Table `".green + table.name + "` created successfully in database `".green + config.db + "`".green);
                        conn.close();
                        next();
                    });
                }
            });
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
        console.log("\t=> Creating database `".grey + config.db + "`".grey);
        self.createDb(config.db, function(err, result) {
            console.log("\t=> Database `".green + config.db + "` created successfully".green);
            async.each(tables, self.createTable, function(err) {
                assert.ok(err === null, err);
                next(err, err === null);
            });
        });
    };

    self.setup = function () {
        self.connect({ host: config.host, db: config.name, port: config.port }, function (err, db) {
            console.log("Running database setup...".grey);
            self.install(config.tables, function (err, result) {
                assert(err === null, err);
                // TODO: figure out why this line is never called...
                console.log("Database `setup` completed successfully".green);
            });
        });
    };

    return self;
};

var RethinkDbAdapter = function (config) {
    var self = this;
    var db = new SecondThought(config);
    var dataSource = config.name;

    self.setup = function () {
        db.setup();
    };

    self.saveTrackingData = function (data, next) {
        db.connect({ db: dataSource }, function (err, db) {
            assert.ok(err === null, err);

            db.tracking_data.save(data, next);
        });
    };

    self.pageViewExists = function (url, next) {
        db.connect({ db: dataSource }, function (err, db) {
            db.pageviews.exists({ page: url }, function (err, exists) {
                assert.ok(err === null, err);
                next(null, exists);
            });
        });
    };

    self.addPageView = function (pageView, next) {
        db.connect({ db: dataSource }, function (err, db) {
            db.pageviews.save(pageView, function (err, doc) {
                assert.ok(err === null, err);
                next(null, doc);
            });
        });
    };

    self.getPageView = function (url, next) {
        db.connect({ db: dataSource }, function (err, db) {
            db.pageviews.first({ page: url }, function (err, pageView) {
                assert.ok(err === null, err);
                next(null, pageView);
            });
        });
    };

    self.updatePageView = function (data, next) {
        db.connect({ db: dataSource }, function (err, db) {
            db.pageviews.updateOnly(data.new, data.id, function (err, result) {
                assert.ok(err === null, err);
                next(null, result);
            });
        });
    };

    self.referrerExists = function (url, next) {
        db.connect({ db: dataSource }, function (err, db) {
            db.referrers.exists({ referrer: url }, function (err, exists) {
                assert.ok(err === null, err);
                next(null, exists);
            });
        });
    };

    self.addReferrer = function (referrer, next) {
        db.connect({ db: dataSource }, function (err, db) {
            db.referrers.save(referrer, function (err, doc) {
                assert.ok(err === null, err);
                next(null, doc);
            });
        });
    };

    self.getReferrer = function (url, next) {
        db.connect({ db: dataSource }, function (err, db) {
            db.referrers.first({ referrer: url }, function (err, referrer) {
                assert.ok(err === null, err);
                next(null, referrer);
            });
        });
    };

    self.updateReferrer = function (data, next) {
        db.connect({ db: dataSource }, function (err, db) {
            db.referrers.updateOnly(data.new, data.id, function (err, result) {
                assert.ok(err === null, err);
                next(null, result);
            });
        });
    };

    self.saveIpGeoData = function (data, next) {
        console.log(data);
        next();
    };

    return self;
};

module.exports = function (config) {
    return new RethinkDbAdapter(config);
};
