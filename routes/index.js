var factual = require("../lib/factual");

module.exports = function(app) {
  app.get("/", function (req, res, next) {
    res.render('index', { title: 'Express' });
  });

  app.all("/search", function (req, res) {
    point = [req.body.lat, req.body.lng]
    factual.getData(point, function (err, data) {
      res.json(err ? [] : data);
    });
  });
};
