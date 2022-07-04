const connection = require("../db/connection");

exports.fetchArticleById = (article_id) => {
    console.log(article_id)
  return connection
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {

//  if (result.rowCount === 0) {
//     return Promise.reject({
//       status: 404,
//       msg: "Invalid article - ID",
//     });
//   }


      return result.rows[0];
    })
    .catch((err) => {
      return err;
    });
};


