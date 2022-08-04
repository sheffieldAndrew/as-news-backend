const jsonData = require("../endpoints.json");

exports.getEndpoints = (req, res, next) => {
  res.json(jsonData);
};
