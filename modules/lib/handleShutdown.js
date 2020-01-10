let server;
let logger;
let callback;

// A graceful shutdown is one where we close the server before process.exit
function graceful() {
  logger.info('Gracefully shutting down...');
  server.close(() => {
    logger.info('Server stopped.');
    callback(() => {
      logger.info('Done.');
      process.exit();
    });
  });
}

// An awkward shutdown is one where we DON'T close the server before process.exit
function awkward() {
  logger.info('Awkwardly shutting down...');
  callback(() => {
    logger.info('Done.');
    process.exit();
  });
}

module.exports = function handleShutdown(serv, { log = console }, cb) {

  server = serv;
  logger = log;
  callback = cb;

  // ECS should send SIGINT prior to shutting our task down.
  // Catch this signal, then shutdown gracefully.
  process.on('SIGINT', () => {
    logger.info('Received SIGINT!');
    graceful();
  });

  // UnhandledPromiseRejectionWarnings are emitted if promise chains fail to have a .catch
  // or async/await call is not wrapped in try/catch. Express, nor any wrapping mechanism
  // is able to catch this case of programmer error. In this terrible case, server.close
  // does not work, so sadly we cannot even shutdown the server gracefully.
  // If we do not handle this by shutting down, then we will leak memory or resources like
  // sockets, etc.
  process.on('unhandledRejection', reason => {
    logger.error(`Unhandled Rejection at , ${reason.stack || reason || 'UNKOWN'}`);
    awkward();
  });
};

// Export the graceful shutdown function so it can be used in
// other places, namely in the error handler.
module.exports.graceful = graceful;