module.exports = function healthCheck(healthCheckCb) {
    return (req, res) => {
      healthCheckCb(err => {
        if (err) {
          req.log.info(`Health check failed. Err: ${err}`);
          return res.status(500).send({
            healthy: false,
            error: err.toString()
          });
        }
        res.status(200).send({
          healthy: true
        });
      });
    };
  };