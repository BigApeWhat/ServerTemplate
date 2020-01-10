const app = require('./modules/express.js');
const logger = require('./logger.js');
const errorTranslator = require('./modules/error.js');

const routes = require('./routes/default');
const unless = require('express-unless');

logger.middleware.unless = unless;
logger.middleware = logger.middleware.unless({ path: '/healthcheck' });

const routing = [{
    path: '/api/v1',
    router: [routes]
}]

options = {
    errorTranslator,
    logger,
    port: 5060
}

app(routing, options)
