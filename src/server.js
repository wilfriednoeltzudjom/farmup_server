const webServer = require('./infrastructure/web_server');
const logger = require('./infrastructure/logger');
const envHelper = require('./application/helpers/env.helper');
const databaseHelper = require('./application/helpers/database.helper');

function initEnvironmentVariables() {
  if (process.env.NODE_ENV !== 'production') {
    envHelper.loadEnvFile('default');
    envHelper.loadEnvFile(process.env.NODE_ENV);
  }
}

function initLogger() {
  if (process.env.NODE_ENV === 'production') {
    logger.initProductionTransports();
  }
}

function startServer() {
  initEnvironmentVariables();
  initLogger();

  const PORT = process.env.PORT || process.env.SERVER_PORT;
  webServer
    .start(PORT)
    .then(() => {
      logger.info(`Server has started on port ${PORT}`);

      databaseHelper
        .connectDatabase()
        .then(() => {
          logger.info(`Successfully connected to database at uri: ${process.env.MONGODB_URI}`);
        })
        .catch((error) => {
          logger.error(error.message);
        });
    })
    .catch((error) => {
      logger.error(error.message);
    });
}
startServer();
