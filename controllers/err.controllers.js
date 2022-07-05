exports.handlesInvalidPaths404 = (req, res) => {
  res.status(404).send({ msg: "bad path" });
};

exports.handlesCustomError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlesPsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid - article must be a number" });
  } else {
    next(err);
  }
};

exports.handles500s = (err, req, res, next) => {
  res.status(500).send({ msg: "Server error - something is wrong" });
};
