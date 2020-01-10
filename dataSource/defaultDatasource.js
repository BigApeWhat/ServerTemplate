// const request = require('request');

const defaultMapper = require('./validator/defaultMapper');
const resPayload = require('../payloadResponses/sample.json');

function getDefault(req, done) {
  // const url = `${config.default_base_url}/someurl`;
  // const msg = `Calling ${url}`;

  // const opts = {
  //   headers,
  // };

  // request.get(url, opts, (err, resp) => {
  //   const map = defaultMapper.defaultApiToEntity(err, resp, msg);
  //   done(map.err, map.data);
  // });
  const msg = `Getting default stuff`;
  done( defaultMapper.defaultApiToEntity(null, { body: resPayload }, msg));
}

module.exports = {
  getDefault
};
