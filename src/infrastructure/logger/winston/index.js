const { createLogger, format, transports } = require('winston');

const Logger = require('../interface');

const timestampFormat = format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' });

module.exports = class WinstonLogger extends Logger {
  static logger = createLogger({
    transports: [
      new transports.Console({
        level: 'info',
        format: format.combine(
          format.colorize(),
          timestampFormat,
          format.printf(({ timestamp, level, message }) => `[logger] ${timestamp} ${level}: ${message}`)
        ),
      }),
    ],
  });

  initProductionTransports() {
    WinstonLogger.logger
      .add(
        new transports.File({
          filename: 'errors.log',
          level: 'error',
          format: format.combine(timestampFormat, format.json()),
        })
      )
      .add(
        new transports.File({
          filename: 'combined.log',
          level: 'debug',
          format: format.combine(timestampFormat, format.json()),
        })
      );
  }

  info(message) {
    WinstonLogger.logger.info(message);
  }

  error(message) {
    WinstonLogger.logger.error(message);
  }

  warning(message) {
    WinstonLogger.logger.warn(message);
  }
};
