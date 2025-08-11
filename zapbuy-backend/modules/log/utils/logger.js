const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');

// Ensure logs directory exists
const logDir = path.join(__dirname, '../../..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, meta }) => {
    const moduleTag = meta && meta.module ? `[${meta.module.toUpperCase()}]` : '[GENERAL]';
    const { module, ...restMeta } = meta || {};
    const metaString = Object.keys(restMeta).length ? JSON.stringify(restMeta) : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${moduleTag} ${message} ${metaString}`;
  })
);

// Create logger
const logger = createLogger({
  format: logFormat,
  transports: [
    new transports.File({
      filename: path.join(logDir, 'zapbuy.log'),
      level: 'info',
    }),
    new transports.File({
      filename: path.join(logDir, 'zapbuy.error.log'),
      level: 'error',
    }),
  ],
});

module.exports = logger;
