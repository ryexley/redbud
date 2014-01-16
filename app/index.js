var express = require("express");
var app = express();

app.use(app.router);
app.use(express.static(__dirname + "/public"));
app.use(express.errorHandler());

app.set("views", __dirname + "/views");
app.set("view engine", "jade");

app.listen(3000);
console.log("Redbud server listening on port 3000");
