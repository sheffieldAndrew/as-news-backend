const connection = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return connection
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `article ${article_id} - does not exist`,
        });
      }
      return result.rows[0];
    });
};

exports.patchArticleById = (incl_votes, article_id) => {
return connection.query(`UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING * ;`,
[incl_votes, article_id])
.then((updatedArticleInfo)=>{
return updatedArticleInfo.rows[0]
})
}

