var express = require("express");
var config = require("./config")();
var db = require("./data")(config);
var app = express();

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

db.setup();

app.use(app.router);

app.post("/track", function (req, res, next) {
    db.saveTrackingData(req.body, function () {
        res.send({ message: "success" });
        console.log("Tracking data saved");
    });
});

app.listen(app.get("port"));
console.log("Redbud server listening on port " + app.get("port"));
