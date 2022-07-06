const connection = require("../db/connection");

exports.fetchCommentsByArticleId = async (article_id) => {
  if (isNaN(+article_id)) {
    return Promise.reject({
      status: 400,
      msg: `article id must be a number`,
    });
  }

  const articleValidate = await connection.query(
    `
SELECT * FROM articles
WHERE article_id = $1
`,
    [article_id]
  );

  if (articleValidate.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `article ${article_id} - does not exist`,
    });
  }

  const commentsForArticle = await connection.query(
    `SELECT * FROM comments
WHERE article_id = $1`,
    [article_id]
  );

  return commentsForArticle.rows;
};
