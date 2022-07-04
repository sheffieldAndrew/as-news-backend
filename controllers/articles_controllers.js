const {fetchArticleById} = require("../models/articles_models")


exports.getArticleById = (req, res) => {
const {article_id} = req.params
fetchArticleById(article_id).then((result)=> {
    res.status(200).send({article: result})
})
}


//GET
// exports.function_name = (req, res, next) => {
//   const { query } = req.query; //queries
//   const { params } = req.params; // params

//   model_function_name(optional)
//     .then((result) => {
//       res.status(200).send({ result: result });
//     })
//     .catch((err) => {
//       next(err);
//     });
// };