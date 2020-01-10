const _ = require('lodash');
const bunyan = require('bunyan');
const onResponse = require('on-response');

module.exports = function logger(options = {}) {

  const {
    name = 'Default App Name',
    middlewareOpts = {}
  } = options;

  const logger = bunyan.createLogger({ name });

  logger.middleware = (req, res, next) => {

    req.log = logger;

    onResponse(req, res, (err, summary) => {

      if (err) {
        return next(new ServiceError(err, `Error in onResponse handler ${err.message}`));
      }

      const fieldMap = { req, res, summary };

      const logObj = {};

      Object.keys(middlewareOpts).forEach(key => {
        const val = middlewareOpts[key];
        const split = val.split('.');
        const source = fieldMap[split[0]];
        if (!source) {
          return logger.error(`Logger: Could not find ${val} in loggable objects`);
        }
        const logVal = _.get(source, split.slice(1));
        if (!logVal) {
          return;
        }
        logObj[key] = logVal;
      });

      logger.info(logObj);
    });
    next();
  };

  return logger;
};