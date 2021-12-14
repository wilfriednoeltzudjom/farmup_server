const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const farmRoutes = require('./routes/farm.routes');
const fileRoutes = require('./routes/file.routes');

const loggingMiddleware = require('./middlewares/logging.middleware');
const authMiddleware = require('./middlewares/auth.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const databaseHelper = require('../../../application/helpers/database.helper');
const cronJob = require('../../cron_job');
const logger = require('../../logger');
const { increaseBandsChickensAgesCronJob } = require('../../../cron_jobs');

const app = express();

function start(port) {
  app.use(loggingMiddleware);
  app.use(cors({ credentials: true, origin: [process.env.FRONT_APP_BASE_URL, process.env.FRONT_STORYBOOK_BASE_URL] }));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());

  app.use('/v1/auth', authRoutes);
  app.use('/v1/farms', authMiddleware, farmRoutes);
  app.use('/v1/files', authMiddleware, fileRoutes);

  if (process.env.NODE_ENV === 'test') {
    app.delete('/v1/database', (_, res, next) => {
      databaseHelper
        .clearDatabase()
        .then(() => res.end())
        .catch((error) => next(error));
    });
  }

  cronJob.schedule('0 0 */1 * * *', async function () {
    await increaseBandsChickensAgesCronJob.execute();
  });
  logger.info('Cron job <increase chickens ages> has been scheduled');

  app.use(errorMiddleware);

  return new Promise((resolve) => {
    app.listen(port, resolve);
  });
}

module.exports = { start };
