const express = require('express');

const { fileController } = require('../../../../controllers');
const HttpRequest = require('../../../../application/payloads/http-request');
const uploadHandlerMiddleware = require('../middlewares/upload.middleware');

const router = express.Router();

router.post('/', uploadHandlerMiddleware, (req, res, next) => {
  fileController
    .uploadFile(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.delete('/', (req, res, next) => {
  fileController
    .deleteFile(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

module.exports = router;
