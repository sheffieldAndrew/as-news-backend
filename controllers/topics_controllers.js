const { fetchTopics } = require("../models/topics_models");

exports.getTopics = (req, res) => {
  fetchTopics()
    .then((result) => {
      res.status(200).send({ topics: result });
    })
    .catch((err) => {
      return err;
    });
};
