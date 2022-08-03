const fs = require("fs");

exports.fetchEndpoints = () => {
  fs.readFile(`../endpoints.json`, "utf8").then((err, data) => {
    if (err) reject(err);
    else {
      console.log(data);
      return JSON.parse(data);
    }
  });
};
