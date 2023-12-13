const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const isAuth = require('../middleware/is-auth');

// /user/ => GET
router.get('/users/', usersController.getUsers);

// L'utilisateur actuellement connecté /user/ (profil utilisateur)
router.get('/user/', isAuth, usersController.getUser);

// un utilisateur avec son id /user/:id
router.get('/user/:id', usersController.getUserById);

// une voiture avec son id 
router.get('/car/:id', usersController.getUserCar);

// Mise à jour de la localisation d'une voiture (user)
router.put('/car/location/:id', usersController.updateCarLocation);

// Mise à jour de la localisation d'une voiture (valet)
router.put('/car/move/:id', usersController.moveCar);

// Mise à jour de l'état d'une voiture
router.put('/car/recup-car/:id', usersController.recupVoiture);

// Suppression de l'utilisateur actuellement connecté
router.delete('/user/', isAuth, usersController.deleteUser);

module.exports = router;

