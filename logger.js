module.exports = require('./modules/logger')({
    name: 'Test Service',
    middlewareOpts: {
      traceId: 'req.headers.x-traceid',
      status: 'res.statusCode',
      method: 'summary.request.method',
      url: 'summary.request.url',
      length: 'summary.response.length',
      time: 'summary.response.time'
    }
  });