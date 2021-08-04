const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const serviceController = require('../controllers/service');
const { createServiceValidate } = require('../validations/service');

/* eslint-disable prettier/prettier */
router.post('/services', createServiceValidate, asyncMiddleware(serviceController.createService));
/* eslint-enable prettier/prettier */

module.exports = router;
