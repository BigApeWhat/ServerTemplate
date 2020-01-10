const ServiceError = require('../../modules/error');
const _ = require('lodash');

module.exports = {
  validate(fieldToCheck) {
    // const entity = _.find(fieldToCheck, { somethingToValidate });

    // if (!entity) {
    //   return new ServiceError('Bad Request - No valid field sent in body:', 400);
    // }

    return { fieldToCheck }; 
  }
};
