const ServiceError = require('../../modules/error');

const serializePostOrder = {
  ordersResponse: [
    {
      responseType: 'SUCCESS'
    }
  ]
};

module.exports = {
  serializePostOrder(data) {
    // other checks that may be needed

    if (!data) {
      return new ServiceError('Expect data not to be null');
    }

    return data;
  }
};
