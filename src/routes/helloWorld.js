const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const indexController = require('../controllers');
const { helloWorldValidate } = require('../validations');

/* eslint-disable prettier/prettier */
router.get('/hello-world', helloWorldValidate, asyncMiddleware(indexController.helloWorld));
/* eslint-enable prettier/prettier */

module.exports = router;
