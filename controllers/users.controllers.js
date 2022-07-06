const { fetchUsers } = require("../models/users.models");

exports.getUsers = (req, res) => {
  fetchUsers()
    .then((result) => {
      res.status(200).send({ users: result });
    })
    .catch((err) => {
      return err;
    });
};
