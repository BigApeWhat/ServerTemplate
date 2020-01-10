const defaultDatasource = require('../dataSource/defaultDatasource');

module.exports.getDefault = function getDefault(bundle, callback) {
  const { req } = bundle;
  defaultDatasource.getDefault(req, callback);
};

// all other default endpoints would be here
// handle reconnects - and any other low level data details
// would be nice to send Results wrapped in network results by statusCode, such as UnathorizedUser(data)
