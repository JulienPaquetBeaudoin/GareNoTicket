const Histo = require('../models/historique');
const Facture = require('../models/facture');

exports.getHistorique = async (req, res, next) => {
  const userId = req.user.userId;
  console.log('userId', userId)
  try {
    const histo = await Histo
    .find({ userId: userId })
    .sort({ createdAt: -1 });
    if (!histo) {
      const error = new Error('Aucun historique trouvé.');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      histo: histo
    });
  } catch (err) {
    next(err);
  }
}

exports.nouveauDeplacement = async (req, res, next) => {
  const { id_user, id_valet, prix  } = req.body;
  try {
    const nouveauHisto = new Histo({
      userId: id_user,
      valetId: id_valet,
      price: prix,
      isPaid: false
    });

    const result = await nouveauHisto.save();

    res.status(201).json({
      message: 'Nouveau déplacement créé avec succès.',
      histo: result
    });
  } catch (err) {
    next(err);
  }
}

exports.effectuerPaiement = async (req, res, next) => {
  const userId = req.user.userId;
  const { price } = req.body;
  try {
    await Histo.updateMany(
      { userId: userId },
      { $set: { isPaid: true } }
    );

    const nouvelleFacture = new Facture({
      userId: userId,
      price: price
    });

    const result = await nouvelleFacture.save();

    res.status(200).json({
      message: 'Paiement effectué avec succès. Nouvelle facture créée.',
      facture: result
    });
  } catch (err) {
    next(err);
  }
}

exports.getFacture = async (req, res, next) => {
  const userId = req.user.userId;
  try{
    const factures = await Facture.find({ userId: userId });
    if (!factures) {
      const error = new Error('Aucune facture trouvée.');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      factures: factures
    });
  } catch (err) {
    next(err);
  }
}

