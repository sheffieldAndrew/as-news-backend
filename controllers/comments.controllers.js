const { fetchCommentsByArticleId, insertCommentByArticleId } = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((result) => {
      res.status(200).send({ comments: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
    insertCommentByArticleId(req.body, req.params)
    .then((comment) => {
      res.status(200).send(comment);
    }) 
    .catch((err) => {
      next(err);
    });
};

