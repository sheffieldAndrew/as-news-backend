const express = require("express");
const app = express();

const {getEndpoints} = require("./controllers/api_controllers");

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

const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require("./controllers/comments.controllers");

const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.patch("/api/articles/:article_id", updateArticleById);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use("*", handlesInvalidPaths404);

app.use(handlesCustomError);

app.use(handlesPsqlErrors);

app.use(handles500s);

module.exports = app;
