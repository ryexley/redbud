var express = require("express");
var config = require("./config")();
var db = require("./data")(config.database);
var request = require("superagent");
var app = express();

// IP address geo lookup:
//
// http://ip-api.com (try first...provides more data)
// -> http://ip-api.com/json/69.245.41.222
//
// http://freegeoip.net (fallback option)
// -> http://freegeoip.net/json/69.245.41.222
var getGeoData = function (ip, done) {
    ip = "69.245.41.222";
    var self = this;
    var geo = {};
    var saveParsed = function (parsedGeo) {
        done(null, parsedGeo);
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
};

var parseGeo = function (geo, done) {
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

db.setup();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + "/public"));
app.use(express.favicon());
app.use(express.errorHandler());

app.set("port", process.env.PORT || 3000);
app.set("views", __dirname + "/views");
app.set("view engine", "jade");

app.all("*", function (req, res, next) {
    if (!req.get("Origin")) {
        return next();
    }

    res.set("Access-Control-Allow-Origin", "http://localhost:3000");
    res.set("Access-Control-Allow-Origin", "http://localhost:4000");
    res.set("Access-Control-Allow-Origin", "http://redbud-sample.dev");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");

    if ("OPTIONS" === req.method) {
        return res.send(200);
    }

    next();
});

app.use(app.router);

app.post("/track", function (req, res, next) {
    var trackingData = req.body;
    var ip = req.ip;
    trackingData["clientIpAddress"] = ip;
    getGeoData(ip, function (err, results) {
        trackingData.geoData = results || {};
        db.saveTrackingData(trackingData, function (err, doc) {
            res.send({ message: "success", id: doc.id });
            console.log("Tracking data saved");
        });
    });
});

app.listen(app.get("port"));
console.log("Redbud server listening on port " + app.get("port"));
