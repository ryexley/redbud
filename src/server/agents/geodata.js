var request = require("superagent");

var parseGeo = function(geo, done) {
  var results = {
    ip: geo.query || geo.ip || "",
    city: geo.city || "",
    zipCode: geo.zip || geo.zipcode || "",
    region: geo.regionName || geo.region_name || "",
    regionCode: geo.region || geo.region_code || "",
    country: geo.country || geo.country_name || "",
    countryCode: geo.countryCode || geo.country_code || "",
    timezone: geo.timezone || "",
    latitude: geo.lat || geo.latitidue || "",
    longitude: geo.lon || geo.longitude || "",
    areaCode: geo.areacode || "",
    serviceProvider: geo.isp || "",
    serviceProviderOrg: geo.org || ""
  };

  done(results);
}

var public = {
  // IP address geo lookup:
  //
  // http://ip-api.com (try first...provides more data)
  // -> http://ip-api.com/json/69.245.41.222
  //
  // http://freegeoip.net (fallback option)
  // -> http://freegeoip.net/json/69.245.41.222
  fetch: function (ip, next) {
    // TODO: this is hard-coded for testing purposes...
    // remove this line for live use
    ip = "69.245.41.222";
    var self = this;
    var geo = {};
    var saveParsed = function (parsedGeo) {
        next(null, parsedGeo);
    };

    request.get("http://ip-api.com/json/" + ip, function (err, res) {
        if (!err) {
            geo = parseGeo(res.body, saveParsed);
        } else {
            // fallback service request
            request.get("http://freegeoip.net/json/" + ip, function (ferr, fres) { // fallback err/res
                geo = parseGeo(fres.body, saveParsed);
            });
        }
    });
  }
};

module.exports = public;
