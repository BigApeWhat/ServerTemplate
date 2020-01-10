const express = require('express');
const bodyParser = require('body-parser');

const ServiceError = require('./error.js');

const healthCheck = require('./lib/healthCheck');
const errorHandler = require('./lib/errorHandler');
const handleShutdown = require('./lib/handleShutdown');

function defaultCb(done) {
  done();
}

const defaultLogger = {
  info: console.info,
  warn: console.warn,
  error: console.error,
  middleware: (req, res, next) => {
    req.log = defaultLogger;
    next();
  }
};

module.exports = (pathsAndRouters, opts = {}) => {

  const {
    logger = defaultLogger,
    port = 8080,
    healthCheckCb = defaultCb,
    shutdownCb = defaultCb,
    errorTranslator,
    noListen = false
  } = opts;

  const app = express(); // Create the app here so tests can be independent

  // HTTP request logging
  app.use(logger.middleware);

  // Health check
  app.get('/healthcheck', healthCheck(healthCheckCb));

  // Request parsing
  app.use(bodyParser.json(), (err, req, res, next) => {
    // Translate into ServiceError so our error handler recognizes
    // this as an operational error, not a programmer error.
    next(new ServiceError(err, 'Error parsing request JSON', 400));
  });

  // Main application routing
  pathsAndRouters.forEach(pathAndRouter => {
    app.use(pathAndRouter.path, pathAndRouter.router);
  });

  // Error handling
  app.use(errorHandler({ errorTranslator, logger, gracefulShutdown: handleShutdown.graceful }));

  // Option for supertest-based tests
  if (noListen) {
    return app;
  }

  const server = app.listen(port, err => {
    if (err) {
      logger.error(`Error: ${err}`);
      process.exit(1);
    }
    logger.info(`Listening on port ${server.address().port}`);
  });

  handleShutdown(server, { logger }, shutdownCb);
};