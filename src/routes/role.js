const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const roleController = require('../controllers/role');

router.get('/roles', auth, asyncMiddleware(roleController.getRoles));

module.exports = router;
