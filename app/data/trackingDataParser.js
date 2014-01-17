var config = require("../config")();
var db = require("./")(config);
var postal = require("postal");

module.exports = function () {

    // IP address geo lookup:
    //
    // http://ip-api.com
    // -> http://ip-api.com/json/69.245.41.222
    //
    // http://freegeoip.net
    // -> http://freegeoip.net/json/69.245.41.222

    var parser = {

    };

    return parser;

};
