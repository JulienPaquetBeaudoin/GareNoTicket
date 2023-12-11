const express = require('express');
const histoController = require('../controllers/histoController');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/historique', isAuth, histoController.getHistorique);
router.put('/effectuerPaiement', isAuth, histoController.effectuerPaiement);
router.get('/facture', isAuth, histoController.getFacture);
router.put('/nouveauDeplacement', isAuth, histoController.nouveauDeplacement);

module.exports = router;
