const express = require('express');

const { customerController } = require('../../../../controllers');
const HttpRequest = require('../../../../application/payloads/http-request');

const router = express.Router({ mergeParams: true });

router.post('/', (req, res, next) => {
  customerController
    .createCustomer(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.get('/', (req, res, next) => {
  customerController
    .getCustomers(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.get('/analytics', (req, res, next) => {
  customerController
    .getCustomersAnalytics(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.put('/:customerId', (req, res, next) => {
  customerController
    .updateCustomer(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.get('/:customerId', (req, res, next) => {
  customerController
    .getCustomer(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.delete('/:customerId', (req, res, next) => {
  customerController
    .deleteCustomer(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

module.exports = router;
