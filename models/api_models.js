
const fs = require('fs');

exports.fetchEndpoints = () => {
    fs.readFile(`/home/andrewsheffield/Documents/code/ncbootcamp/coursecontent/backend/news-server/endpoints.json`, "utf8").then((err, data) => {
        if (err) reject(err);
        else {
            console.log(data)
          return JSON.parse(data);  
      }
    });
  }


