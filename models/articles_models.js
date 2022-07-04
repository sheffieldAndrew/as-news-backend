const connection = require("../db/connection")


exports.fetchArticleById = (article_id) => {

return connection.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then((result) => {
return result.rows[0]
})
.catch((err)=>{
    return err
})

}

 
//  //PARAMETRIC GET 
//   exports.selectParkById = (park_id) => {
//     return db
//       .query("SELECT * FROM parks WHERE park_id=$1", [park_id])
//       .then((results) => {
//         return results.rows[0];
//       })
//       .catch((err) => console.log(err));
//   };