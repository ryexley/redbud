var express = require("express");
var app = express();

app.use(app.router);
app.use(express.static(__dirname + "/public"));
app.use(express.errorHandler());

app.set("views", __dirname + "/views");
app.set("view engine", "jade");

app.get("/", function (req, res) {
    res.render("index", { title: "Redbud client app" });
});

app.listen("4000");
console.log("Redbud sample app listening on port 4000");
