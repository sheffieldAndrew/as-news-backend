const express = require("express");
const app = express();
const {
  getArticleById,
  updateArticleById,
  getArticles, 
} = require("./controllers/articles_controllers");
const { getTopics } = require("./controllers/topics_controllers");
const { getUsers } = require("./controllers/users.controllers");
const {
  handlesInvalidPaths404,
  handlesCustomError,
  handlesPsqlErrors,
  handles500s,
} = require("./controllers/err.controllers");

const {getCommentsByArticleId, postCommentByArticleId} = require("./controllers/comments.controllers")

app.use(express.json());

//happy paths

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles)

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.patch("/api/articles/:article_id", updateArticleById);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

// err paths
app.use("*", handlesInvalidPaths404);

app.use(handlesCustomError);

app.use(handlesPsqlErrors);

app.use(handles500s);

module.exports = app;
