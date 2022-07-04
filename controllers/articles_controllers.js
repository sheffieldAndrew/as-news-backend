const {fetchArticleById} = require("../models/articles_models")


exports.getArticleById = (req, res, next) => {
const {article_id} = req.params
fetchArticleById(article_id).then((result)=> {
      res.status(200).send({article: result})
})
.catch((err)=>{
    return next(err)
})
}

