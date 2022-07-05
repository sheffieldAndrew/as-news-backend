const express = require("express");
const app = express();
app.use(express.json());
const { getArticleById } = require("./controllers/articles_controllers");
const { getTopics } = require("./controllers/topics_controllers");
const { getUsers } = require("./controllers/users.controllers");
const {
  handlesInvalidPaths404,
  handlesCustomError,
  handlesPsqlErrors,
  handles500s,
} = require("./controllers/err.controllers");

//happy paths

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getUsers);

// err paths
app.use("*", handlesInvalidPaths404);

app.use(handlesCustomError);

app.use(handlesPsqlErrors);

app.use(handles500s);

module.exports = app;
