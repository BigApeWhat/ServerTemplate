const ServiceError = require('../error');

// Returns an array of error handling middlewares
module.exports = ({ errorTranslator, logger, gracefulShutdown }) => [

  (req, res, next) => {
    next(new ServiceError('Endpoint not implemented', 501));
  },

  (err, req, res, next) => { // eslint-disable-line no-unused-vars

    let fatal = false;

    if (!(err instanceof ServiceError)) {
      // This is a programmer error, we should die and let our process manager restart us.
      fatal = true;
      const e = new ServiceError(err, 'SERIOUS UNHANDLED ERROR', 500);
      logger.error(e);
      err = e; // eslint-disable-line no-param-reassign
    }

    logger.error(err.stack);

    if (typeof errorTranslator === 'function') {
      errorTranslator(err);
    }
    res.status(err.status || 500).send(err);
    if (fatal && typeof gracefulShutdown === 'function') {
      gracefulShutdown();
    }
  },
];