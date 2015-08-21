"use strict";

var debug = require("debug")("redbud:router");
var express = require("express");
var GeoData = require("../agents/geodata");
var config = require("../config")();
// var db = require("../data")(config.database);

var router = express.Router();

router.get("/", function (req, res, next) {
    res.render("index", { title: "Redbud Analytics" });
});

router.post("/track", function (req, res, next) {
    var trackingData = req.body;
    var ip = req.ip;
    trackingData["clientIpAddress"] = ip;
    GeoData.fetch(ip, function (err, results) {
        trackingData.geoData = results || {};
        debug("Saving tracking data:", trackingData);
        // db.saveTrackingData(trackingData, function (err, doc) {
        //     res.send({ message: "success", id: doc.id });
        //     console.log("Tracking data saved");
        // });
    });
});

module.exports = router;
