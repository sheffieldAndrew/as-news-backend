const {
  fetchArticleById,
  patchArticleById,
  fetchArticles
} = require("../models/articles_models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { incl_votes } = req.body;
  patchArticleById(incl_votes, article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};


exports.getArticles = (req, res) => {
  fetchArticles()
    .then((result) => {
      res.status(200).send({ articles: result });
    })
    .catch((err) => {
      return err;
    });
};

