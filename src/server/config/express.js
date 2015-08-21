"use strict";

var path = require("path");
var debug = require("debug")("redbud");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var errorHandler = require("errorhandler");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cors = require("../middleware/cors");
var routes = require("../routes");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, "../public")));
app.use(favicon(path.resolve(__dirname, "../public/favicon.ico")));
app.use(errorHandler());

app.set("views", path.resolve(__dirname, "../views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(cors);

app.use("/", routes);

module.exports = app;
