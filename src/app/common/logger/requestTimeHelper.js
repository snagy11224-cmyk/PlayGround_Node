const logger = require("../../common/logger/logger");

const THRESHOLD_MS = Number(process.env.SLOW_REQUEST_THRESHOLD_MS) || 500;

module.exports = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    if (duration > THRESHOLD_MS) {
      logger.warn("Slow request detected", {
        method: req.method,
        url: req.originalUrl,
        durationMs: duration,
        correlationId: req.correlationId,
        statusCode: res.statusCode,
      });
    }
  });

  next();
};
