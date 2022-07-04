const connection = require("../db/connection");

exports.fetchTopics = () => {
  return connection
    .query("SELECT slug, description FROM topics;")
    .then((topics) => {
      return topics.rows;
    })
    .catch((err) => {
      return err;
    });
};
