var config = require("../config")();
var db = require("./")(config);

var parser = function () {

    console.log("Tracking data parser loaded");

    // IP address geo lookup:
    //
    // http://ip-api.com (try first...provides more data)
    // -> http://ip-api.com/json/69.245.41.222
    //
    // http://freegeoip.net (fallback option)
    // -> http://freegeoip.net/json/69.245.41.222

    var parser = {

        foo: function (data) {
            console.log("I pity da foo...", data);
        }

    };

    return parser;

};

module.exports = parser();
