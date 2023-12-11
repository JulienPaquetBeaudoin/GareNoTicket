const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.put('/profil-update/:userId', authController.updateProfile)


module.exports = router;
