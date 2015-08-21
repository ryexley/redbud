var cors = function(req, res, next) {
  if (!req.get("Origin")) {
    return next();
  }

  res.set("Access-Control-Allow-Origin", "http://localhost:3000");
  res.set("Access-Control-Allow-Origin", "http://localhost:4000");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");

  if ("OPTIONS" === req.method) {
    return res.send(200);
  }

  next();
}

module.exports = cors;
