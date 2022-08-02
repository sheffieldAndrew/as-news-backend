const {fetchEndpoints} = require('../models/api_models');

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
    .then((data) => {
        res.status(200).send({ endpoints: JSON.parse(data) });
    })
    .catch(next);
};

