const express = require('express');

const { authController } = require('../../../../controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const HttpRequest = require('../../../../application/payloads/http-request');
const { COOKIE_MAX_AGE, TOKEN_COOKIE, SESSION_ID_COOKIE } = require('../../../../application/helpers/constants');

const router = express.Router();

function setSignInCookies(res, response) {
  const cookiesOptions = { maxAge: COOKIE_MAX_AGE, httpOnly: true };
  if (process.env.NODE_ENV !== 'development') {
    cookiesOptions.sameSite = 'none';
    cookiesOptions.secure = true;
  }
  res.cookie(TOKEN_COOKIE, response.data.token, cookiesOptions);
  res.cookie(SESSION_ID_COOKIE, response.data.session.id, cookiesOptions);
}

router.post('/sign-in', (req, res, next) => {
  authController
    .signIn(HttpRequest.fromExpress(req))
    .then((response) => {
      setSignInCookies(res, response);
      res.status(response.status).json(response.toJSON());
    })
    .catch((error) => next(error));
});

router.post('/sign-up', (req, res, next) => {
  authController
    .signUp(HttpRequest.fromExpress(req))
    .then((response) => {
      setSignInCookies(res, response);
      res.status(response.status).json(response.toJSON());
    })
    .catch((error) => next(error));
});

router.put('/sign-out', authMiddleware, (req, res, next) => {
  authController
    .signOut(HttpRequest.fromExpress(req))
    .then((response) => {
      res.clearCookie(TOKEN_COOKIE);
      res.clearCookie(SESSION_ID_COOKIE);
      res.status(response.status).json(response.toJSON());
    })
    .catch((error) => next(error));
});

router.get('/profile', authMiddleware, (req, res, next) => {
  authController
    .getProfile(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch((error) => next(error));
});

module.exports = router;
