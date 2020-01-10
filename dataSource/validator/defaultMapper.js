const ServiceError = require('../../modules/error');
const _ = require('lodash');

module.exports = {
  defaultApiToEntity(err, resp, msg) {
    // check and parse data else return error

    if (err) {
      return new AetnaDigitalError(err, `Error ${msg}`);
    }

    const data = _.get(resp, 'body');
    if (!data) {
      return new ServiceError(`Error, no 'body' property inside the response: ${resp}`, 500);
    }
    return { err: null, data };
  }
};
