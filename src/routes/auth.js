const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth, checkAuthClientSecret } = require('../middlewares/auth');
const { ssoUserValidate } = require('../validations/auth');
const authController = require('../controllers/auth');

router.post(
  '/sso/webhooks',
  checkAuthClientSecret,
  ssoUserValidate,
  asyncMiddleware(authController.actionWebhookSso),
);

router.get('/auths/verify', auth, asyncMiddleware(authController.verifyToken));

module.exports = router;
