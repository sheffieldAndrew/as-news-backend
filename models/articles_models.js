const connection = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return connection
    .query(
      `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count 
    FROM articles 
    JOIN comments 
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
      [article_id]
    )
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

exports.patchArticleById = (inc_votes, article_id) => {
  if (typeof inc_votes !== "number" || !inc_votes)
    return Promise.reject({
      status: 400,
      msg: "Invalid - input must be in form {inc_votes: number}",
    });

  return connection
    .query(
      `UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING * ;`,
      [inc_votes, article_id]
    )
    .then((updatedArticleInfo) => {
      if (updatedArticleInfo.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `article ${article_id} - does not exist`,
        });
      }

      return updatedArticleInfo.rows[0];
    });
};

exports.fetchArticles = () => {
  return connection
    .query(
      `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC`
    )
    .then((articles) => {
      return articles.rows;
    })
    .catch((err) => {
      return err;
    });
};
