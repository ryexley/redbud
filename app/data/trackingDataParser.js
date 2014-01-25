var _ = require("lodash");
var assert = require("assert");
var async = require("async");
var request = require("superagent");

var Parser = function (db) {

    var parser = {

        processTrackingData: function (data) {
            // don't log anything if there isn't a siteId associated with it
            if (data.siteId && data.siteId !== "") {
                async.parallel([
                    this.pageView(data.siteId, data.url, this.onPageViewDone),
                    this.referrer(data.siteId, data.referrer, this.onReferrerDone),
                    this.browserInfo(data.browserInfo, this.onBrowserInfoDone),
                    this.geo(data.clientIpAddress, this.onGeoDone)
                ], this.onProcessTrackingDataDone);
            }
        },

        onProcessTrackingDataDone: function (err, results) {
            console.log("Parsing: Tracking data completed successfully");
        },

        pageView: function (site, url, done) {
            db.pageViewExists(site, url, function (err, exists) {
                if (exists) {
                    db.getPageView(site, url, function (err, pageView) {
                        db.updatePageView({
                            id: pageView.id,
                            new: {
                                hits: parseInt(pageView.hits, 10) + 1,
                                lastHit: new Date()
                            }
                        }, function (err, result) {
                            assert.ok(err === null, err);
                            done(null, result);
                        });
                    });
                } else {
                    db.addPageView({
                        siteId: site,
                        page: url,
                        hits: 1,
                        lastHit: new Date()
                    }, function (err, result) {
                        assert.ok(err === null, err);
                        done(null, result);
                    });
                }
            });
        },

        onPageViewDone: function (err, results) {
            console.log("Parsing: pageView complete");
        },

        // TODO: parse referrer to see if the inbound request is coming from a
        //       google search result, and if it is, grab the search terms from
        //       "q" parameter of the querystring and persist as search terms
        referrer: function (site, url, done) {
            db.referrerExists(site, url, function (err, exists) {
                if (exists) {
                    db.getReferrer(site, url, function (err, referrer) {
                        db.updateReferrer({
                            id: referrer.id,
                            new: {
                                count: parseInt(referrer.count, 10) + 1,
                                lastReferred: new Date()
                            }
                        }, function (err, result) {
                            assert.ok(err === null, err);
                            done(null, result);
                        });
                    });
                } else {
                    db.addReferrer({
                        siteId: site,
                        referrer: url,
                        count: 1,
                        lastReferred: new Date()
                    }, function (err, result) {
                        assert.ok(err === null, err);
                        done(null, result);
                    });
                }
            });
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

        // IP address geo lookup:
        //
        // http://ip-api.com (try first...provides more data)
        // -> http://ip-api.com/json/69.245.41.222
        //
        // http://freegeoip.net (fallback option)
        // -> http://freegeoip.net/json/69.245.41.222
        geo: function (ip, done) {
            ip = "69.245.41.222";
            var self = this;
            var geo = {};
            var saveParsed = function (parsedGeo) {
                db.saveIpGeoData(parsedGeo, function (err, results) {
                    done(null, results);
                });
            };

            request.get("http://ip-api.com/json/" + ip, function (err, res) {
                if (!err) {
                    geo = self.parseGeo(res.body, saveParsed);
                } else {
                    // fallback service request
                    request.get("http://freegeoip.net/json/" + ip, function (ferr, fres) { // fallback err/res
                        geo = self.parseGeo(fres.body, saveParsed);
                    });
                }
            });
        },

        parseGeo: function (geo, done) {
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
