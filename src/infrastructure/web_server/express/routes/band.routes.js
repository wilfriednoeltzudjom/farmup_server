const express = require('express');

const { bandController } = require('../../../../controllers');
const accessRightsHandler = require('../middlewares/access-rights.middleware');
const bandAccessHandler = require('../middlewares/band-access.middleware');
const HttpRequest = require('../../../../application/payloads/http-request');
const { ACCOUNT_ROLES } = require('../../../../database/enums');

const dayRoutes = require('./day.routes');
const expenseRoutes = require('./expense.routes');
const saleRoutes = require('./sale.routes');

const router = express.Router({ mergeParams: true });

router.post('/', accessRightsHandler(ACCOUNT_ROLES.ADMINISTRATOR, ACCOUNT_ROLES.FARM_MANAGER), (req, res, next) => {
  bandController
    .createBand(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.get('/', (req, res, next) => {
  bandController
    .getBands(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.get('/analytics', (req, res, next) => {
  bandController
    .getBandsAnalytics(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.get('/:bandId', (req, res, next) => {
  bandController
    .getBand(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.put('/:bandId', (req, res, next) => {
  bandController
    .updateBand(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.put('/:bandId/startup', accessRightsHandler(ACCOUNT_ROLES.ADMINISTRATOR, ACCOUNT_ROLES.FARM_MANAGER), (req, res, next) => {
  bandController
    .startBand(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.put('/:bandId/cancelation', accessRightsHandler(ACCOUNT_ROLES.ADMINISTRATOR, ACCOUNT_ROLES.FARM_MANAGER), (req, res, next) => {
  bandController
    .cancelBand(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.put('/:bandId/closure', accessRightsHandler(ACCOUNT_ROLES.ADMINISTRATOR, ACCOUNT_ROLES.FARM_MANAGER), (req, res, next) => {
  bandController
    .endBand(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.get('/:bandId/analytics', (req, res, next) => {
  bandController
    .getBandAnalytics(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.delete('/:bandId', accessRightsHandler(ACCOUNT_ROLES.ADMINISTRATOR, ACCOUNT_ROLES.FARM_MANAGER), (req, res, next) => {
  bandController
    .deleteBand(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.use('/:bandId/days', bandAccessHandler, dayRoutes);
router.use('/:bandId/expenses', bandAccessHandler, expenseRoutes);
router.use('/:bandId/sales', bandAccessHandler, saleRoutes);

module.exports = router;
