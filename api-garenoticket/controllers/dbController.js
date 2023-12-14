const Voiture = require("../models/voiture");
const User = require("../models/user");
const Historique = require("../models/historique");
const Facture = require("../models/facture");

const voitures = require("../seeds/voitures");
const users = require("../seeds/users");
const historiques = require("../seeds/historiques");
const factures = require("../seeds/factures");

// Permet de faire la bd
exports.seed = async (req, res, next) => {
  const result = {};

  try {
    await Promise.all([
      Voiture.deleteMany(),
      User.deleteMany(),
      Historique.deleteMany(),
      Facture.deleteMany(),
    ]);

    const [usersInsert, voituresInsert, historiquesInsert, facturesInsert] = await Promise.all([
      User.insertMany(users),
      Voiture.insertMany(voitures),
      Historique.insertMany(historiques),
      Facture.insertMany(factures),
    ]);

    if (voituresInsert.length > 0) {
      result.voitures = voituresInsert;
    }

    if (usersInsert.length > 0) {
      result.users = usersInsert;
    }

    if (historiquesInsert.length > 0) {
      result.historiques = historiquesInsert;
    }

    if (facturesInsert.length > 0) {
      result.factures = facturesInsert;
    }

    res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};