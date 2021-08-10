const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const serviceController = require('../controllers/service');
const {
  createServiceValidate,
  updateServiceValidate,
} = require('../validations/service');

/* eslint-disable prettier/prettier */
router.get('/services', asyncMiddleware(serviceController.getServices));
router.get('/services/:serviceId', asyncMiddleware(serviceController.getService));
router.post('/services', createServiceValidate, asyncMiddleware(serviceController.createService));
router.put('/services/:serviceId', updateServiceValidate, asyncMiddleware(serviceController.updateService));
router.delete('/services/:serviceId', asyncMiddleware(serviceController.deleteService));

/* eslint-enable prettier/prettier */

module.exports = router;
