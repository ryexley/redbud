var assert = require("assert");
var async = require("async");

var Parser = function (db) {

    // assert.ok(db, "No database connection");

    // IP address geo lookup:
    //
    // http://ip-api.com (try first...provides more data)
    // -> http://ip-api.com/json/69.245.41.222
    //
    // http://freegeoip.net (fallback option)
    // -> http://freegeoip.net/json/69.245.41.222

    var parser = {

        processTrackingData: function (data) {
            async.parallel([
                this.pageView(data.url, this.onPageViewDone),
                this.referrer(data.referrer, this.onReferrerDone),
                this.browserInfo(data.browserInfo, this.onBrowserInfoDone),
                this.geo(data.clientIpAddress, this.onGeoDone)
            ], this.onProcessTrackingDataDone);
        },

        onProcessTrackingDataDone: function (err, results) {
            console.log("Parsing: Tracking data completed successfully");
        },

        pageView: function (url, done) {
            db.pageViewExists(url, function (err, exists) {
                if (exists) {
                    db.getPageView(url, function (err, pageView) {
                        db.updatePageView({
                            id: pageView.id,
                            hits: parseInt(pageView.hits, 10) + 1,
                            lastHit: new Date()
                        }, function (err, result) {
                            assert.ok(err === null, err);
                            done(null, result);
                        });
                    });
                } else {
                    db.addPageView({
                        page: url,
                        hits: 1,
                        lastHit: new Date()
                    }, function (err, result) {
                        assert.ok(err === null, err);
                        done(result);
                    });
                }
            });
        },

        onPageViewDone: function (err, results) {
            console.log("Parsing: pageView complete");
        },

        referrer: function (url, done) {
            console.log("Parsing: referrer -> " + url);
            done(null, true);
        },

        onReferrerDone: function (err, results) {
            console.log("Parsing: referrer complete");
        },

        browserInfo: function (data, done) {
            console.log("Parsing: browserInfo -> " + data);
            done(null, true);
        },

        onBrowserInfoDone: function (err, results) {
            console.log("Parsing: browserInfo complete");
        },

        geo: function (ip, done) {
            console.log("Parsing: geo:IP -> " + ip);
            done(null, true);
        },

        onGeoDone: function (err, results) {
            console.log("Parsing: ip/geo complete");
        }

    };

    return parser;

};

module.exports = function (db) {
    return new Parser(db);
};
