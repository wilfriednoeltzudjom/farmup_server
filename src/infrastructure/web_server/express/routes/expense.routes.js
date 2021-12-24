const express = require('express');

const { expenseController } = require('../../../../controllers');
const HttpRequest = require('../../../../application/payloads/http-request');

const router = express.Router({ mergeParams: true });

router.post('/', (req, res, next) => {
  expenseController
    .createExpense(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.get('/', (req, res, next) => {
  expenseController
    .getExpenses(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.put('/:expenseId', (req, res, next) => {
  expenseController
    .updateExpense(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.get('/:expenseId', (req, res, next) => {
  expenseController
    .getExpense(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.delete('/:expenseId', (req, res, next) => {
  expenseController
    .deleteExpense(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

module.exports = router;
