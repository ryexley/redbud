"use strict";

var debug = require("debug")("redbud-sample:router");
var express = require("express");

var router = express.Router();

router.get("/", function (req, res, next) {
    res.render("index", { title: "Redbud sample client app" });
});

router.get("*", function (req, res, next) {
    res.render("index", { title: "Handled wildcard route: " + req.path + " | Redbud sample client app" });
});

module.exports = router;
