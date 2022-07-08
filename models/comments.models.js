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

exports.insertCommentByArticleId = async (body, params) => {
  const newBody = body.body;
  const newUsername = body.userName;
  const { article_id } = params;

  if (!newBody || !newUsername) {
    return Promise.reject({
      status: 400,
      msg: `Invalid - input must be in form {body: String, userName: String`,
    });
  }

  if (isNaN(+article_id)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid - article must be a number`,
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

  return connection
    .query(
      `INSERT INTO comments
      (body, author, article_id)
      VALUES
      ($1, $2, $3)
      RETURNING * ;
      `,
      [newBody, newUsername, article_id]
    )
    .then((newComment) => {
      return newComment.rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  console.log(comment_id);

  if (isNaN(+comment_id)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid - comment_id must be a number`,
    });
  }

  return connection
    .query(`DELETE FROM comments WHERE comment_id=$1`, [comment_id])
    .then((comment) => {
      return comment;
    });
};
