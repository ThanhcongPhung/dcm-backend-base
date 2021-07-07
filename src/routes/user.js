const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth } = require('../middlewares/auth');
const userController = require('../controllers/user');

router.put('/users/:userId', auth, asyncMiddleware(userController.updateUser));
router.get('/users/:userId', asyncMiddleware(userController.getUser));
router.get('/users', asyncMiddleware(userController.getUsers));

module.exports = router;
