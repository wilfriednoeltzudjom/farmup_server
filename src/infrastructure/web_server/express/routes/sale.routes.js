const express = require('express');

const { saleController } = require('../../../../controllers');
const HttpRequest = require('../../../../application/payloads/http-request');

const router = express.Router({ mergeParams: true });

router.post('/', (req, res, next) => {
  saleController
    .createSale(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.get('/', (req, res, next) => {
  saleController
    .getSales(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.put('/:saleId', (req, res, next) => {
  saleController
    .updateSale(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.get('/:saleId', (req, res, next) => {
  saleController
    .getSale(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.delete('/:saleId', (req, res, next) => {
  saleController
    .deleteSale(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

module.exports = router;
