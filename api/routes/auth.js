const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.put('/profil-update/:userId', authController.updateProfile)
router.put('/profil-valet-update/:userId', authController.updateProfileValet)


module.exports = router;
