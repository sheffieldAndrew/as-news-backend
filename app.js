const express = require("express");
const app = express();
app.use(express.json());
const {getArticleById} = require('./controllers/articles_controllers')
const { getTopics} = require("./controllers/topics_controllers");

//happy paths

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById)
// err paths

// 

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Error - No such path" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server error - something is wrong" });
});

module.exports = app;


