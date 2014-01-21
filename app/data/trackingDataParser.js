var assert = require("assert");

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
            this.pageView(data.url);
            this.referrer(data.referrer);
            this.browserInfo(data.browserInfo);
            this.geo(data.clientIpAddress);
        },

        pageView: function (url) {

        },

        referrer: function (url) {

        },

        browserInfo: function (data) {

        },

        geo: function (ip) {

        }

    };

    return parser;

};

module.exports = function (db) {
    return new Parser(db);
};
