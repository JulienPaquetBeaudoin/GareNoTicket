const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Permet de se connecter
router.post('/login', authController.login);
// Permet de s'inscrire
router.post('/signup', authController.signup);
// Permet de update le profil d'un utilisateur
router.put('/profil-update/:userId', authController.updateProfile)
// Permet de update le profil d'un valet ou d'un utilisateur qui n'a pas de voiture
router.put('/profil-valet-update/:userId', authController.updateProfileValet)


module.exports = router;
