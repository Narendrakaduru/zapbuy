const Log = require('../models/log.model');
const logger = require('./logger');

const logToService = async (module, severity, message, meta = {}) => {
  try {
    // Save to DB
    await Log.create({ module, severity, message, meta });

    // Inject module into Winston log
    const logMeta = { ...meta, module };

    if (severity === 'ERROR') {
      logger.error(message, { meta: logMeta });
    } else if (severity === 'WARN') {
      logger.warn(message, { meta: logMeta });
    } else {
      logger.info(message, { meta: logMeta });
    }
  } catch (err) {
    console.error('Failed to log:', err.message);
  }
};

module.exports = logToService;
