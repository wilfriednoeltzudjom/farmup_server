const express = require('express');

const { supplierController } = require('../../../../controllers');
const HttpRequest = require('../../../../application/payloads/http-request');

const router = express.Router({ mergeParams: true });

router.post('/', (req, res, next) => {
  supplierController
    .createSupplier(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.get('/', (req, res, next) => {
  supplierController
    .getSuppliers(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.get('/analytics', (req, res, next) => {
  supplierController
    .getSuppliersAnalytics(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.put('/:supplierId', (req, res, next) => {
  supplierController
    .updateSupplier(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.get('/:supplierId', (req, res, next) => {
  supplierController
    .getSupplier(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.delete('/:supplierId', (req, res, next) => {
  supplierController
    .deleteSupplier(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

module.exports = router;
