const fs = require("fs/promises");

function getJSON() {
  fs.readFile("./test.txt", "utf-8", (err, result) => {
    console.log(result);
  });
}

getJSON();
