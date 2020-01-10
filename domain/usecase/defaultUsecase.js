// const async = require('async');

const ServiceError = require('../../modules/error');

module.exports = (defaultRepository, bundle, callback) => { // Can have multipule repositories
  defaultRepository.getDefault(bundle, callback);

  // async.waterfall([
  //   async.apply(defaultRepository.getSomething, bundle),
  //   async.apply(defaultRepository.doSomething, bundle),
  //   async.apply(defaultRepository.finishSomething, bundle)
  // ], (err, msg) => {
  //   if (err) {
  //     return callback(new ServiceError(err, `Error ${msg}`, err.status || 500));
  //   }

  //   callback(true);
  // });

};

// If buznis logic would need to be done, do it here in another function or class as an integrator, such as ordering or caching
