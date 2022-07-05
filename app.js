const express = require("express");
const app = express();
const {
  getArticleById,
  updateArticleById,
} = require("./controllers/articles_controllers");
const { getTopics } = require("./controllers/topics_controllers");
const {
  handlesInvalidPaths404,
  handlesCustomError,
  handlesPsqlErrors,
  handles500s,
} = require("./controllers/err.controllers");

app.use(express.json());

//happy paths

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", updateArticleById);

// err paths
app.use("*", handlesInvalidPaths404);

app.use(handlesCustomError);

app.use(handlesPsqlErrors);

app.use(handles500s);

module.exports = app;
