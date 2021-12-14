const express = require('express');

const { dayController } = require('../../../../controllers');
const HttpRequest = require('../../../../application/payloads/http-request');

const router = express.Router({ mergeParams: true });

router.get('/', (req, res, next) => {
  dayController
    .getDays(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.get('/:dayId', (req, res, next) => {
  dayController
    .getDay(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.put('/:dayId', (req, res, next) => {
  dayController
    .updateDay(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.post('/:dayId/alimentations', (req, res, next) => {
  dayController
    .addDayAlimentation(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.put('/:dayId/alimentations/:alimentationId', (req, res, next) => {
  dayController
    .updateDayAlimentation(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.delete('/:dayId/alimentations/:alimentationId', (req, res, next) => {
  dayController
    .deleteDayAlimentation(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.post('/:dayId/medecines', (req, res, next) => {
  dayController
    .addDayMedecine(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.put('/:dayId/medecines/:medecineId', (req, res, next) => {
  dayController
    .updateDayMedecine(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.delete('/:dayId/medecines/:medecineId', (req, res, next) => {
  dayController
    .deleteDayMedecine(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.post('/:dayId/deaths', (req, res, next) => {
  dayController
    .addDayDeath(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

router.delete('/:dayId/deaths/:deathId', (req, res, next) => {
  dayController
    .deleteDayDeath(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

module.exports = router;
