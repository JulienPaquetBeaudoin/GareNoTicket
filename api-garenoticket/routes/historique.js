const express = require('express');
const histoController = require('../controllers/histoController');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// Permet de chercher l'historique d'un utilisateur
router.get('/historique', isAuth, histoController.getHistorique);
// Permet d'effectuer un paiement
router.put('/effectuerPaiement', isAuth, histoController.effectuerPaiement);
// Permet de récupérer les factures d'un utilisateur
router.get('/facture', isAuth, histoController.getFacture);
// Permet de faire un nouveau déplacement
router.put('/nouveauDeplacement', isAuth, histoController.nouveauDeplacement);

module.exports = router;
