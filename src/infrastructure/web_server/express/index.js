const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');

const loggingMiddleware = require('./middlewares/logging.middleware');
const authHandler = require('./middlewares/auth.middleware');
const accessRightsHandler = require('./middlewares/access-rights.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

function start(port) {
  app.use(loggingMiddleware);
  app.use(cors({ credentials: true, origin: [process.env.FRONT_APP_BASE_URL] }));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());

  app.use('/v1/auth', authRoutes);

  app.use(errorMiddleware);

  return new Promise((resolve) => {
    app.listen(port, resolve);
  });
}

module.exports = { start };
