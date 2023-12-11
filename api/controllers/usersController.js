const User = require('../models/user');
const Voiture = require('../models/voiture');
const Histo = require('../models/historique');
const config = require('../config');
const url_base = config.URL + ":" + config.PORT;


exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isValet: false }).populate({
      path: 'voiture',
      match: { isParked: true }
    });

    const filteredUsers = users.filter(user => user.voiture != null);
    if (!filteredUsers.length) {
      const error = new Error('Aucun utilisateur trouvé.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      users: filteredUsers
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await checkUserExists(userId);
    res.status(200).json({
      user: user
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const user = await checkUserExists(userId);
    res.status(200).json({
      user: user
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserCar = async (req, res, next) => {
  try {
    const voitureId = req.params.id;
    const voiture = await Voiture.findById(voitureId);
    if (!voiture) {
      const error = new Error('Aucune voiture trouvée pour cet utilisateur.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      voiture: voiture
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCarLocation = async (req, res, next) => {
  try {
    const voitureId = req.params.id;
    const { longitude, latitude } = req.body;

    const voiture = await Voiture.findById(voitureId);
    if (!voiture) {
      const error = new Error('Aucune voiture trouvée avec cet ID.');
      error.statusCode = 404;
      throw error;
    }

    voiture.longitude = longitude;
    voiture.latitude = latitude;
    voiture.isParked = true;
    voiture.isMoving = false;

    const now = new Date();
    if ((now.getHours() >= 9 && now.getHours() < 11) || ((now.getHours() === 13 && now.getMinutes() >= 30) || (now.getHours() > 13 && now.getHours() < 17))) {
      voiture.timeToLeave = new Date(now.getTime() + 60*60000); // Ajoute 60 minutes à l'heure actuelle
    }
    else {
      // Si en dehors des heures autorisées, définir le timeToLeave pour le lendemain
      const tomorrow = new Date(now);
      if (now.getHours() < 9) {
        tomorrow.setHours(10);
        tomorrow.setMinutes(0);
      }
      else if (now.getHours() >= 11 && (date.getHours() === 12 && date.getMinutes() >= 30) || (date.getHours() < 12)) {
        tomorrow.setHours(14);
        tomorrow.setMinutes(30);
      } else {
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10);
        tomorrow.setMinutes(0);
      }
      voiture.timeToLeave = tomorrow;
    }
    await voiture.save();

    res.status(200).json({
      message: 'Location de la voiture mise à jour avec succès.',
      voiture: voiture
    });
  } catch (err) {
    next(err);
  }
};

exports.moveCar = async (req, res, next) => {
  try {
    const voitureId = req.params.id;

    const voiture = await Voiture.findById(voitureId);
    if (!voiture) {
      const error = new Error('Aucune voiture trouvée avec cet ID.');
      error.statusCode = 404;
      throw error;
    }
    voiture.isParked = false;
    voiture.isMoving = true;
    await voiture.save();

    res.status(200).json({
      message: 'Vous déplacez cette voiture.',
      voiture: voiture
    });
  } catch (err) {
    next(err);
  }
};

exports.recupVoiture = async (req, res, next) => {
  try {
    const voitureId = req.params.id;

    const voiture = await Voiture.findById(voitureId);
    if (!voiture) {
      const error = new Error('Aucune voiture trouvée avec cet ID.');
      error.statusCode = 404;
      throw error;
    }
    voiture.isParked = false;
    voiture.isMoving = false;
    await voiture.save();

    res.status(200).json({
      message: 'Vous avez récupéré votre voiture.',
      voiture: voiture
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => { 
  const userId = req.params.userId;
  const { username, email } = req.body;
  console.log("Id User",userId)
  try {
    const user = await User.findById(userId);
    console.log("User", user)
    if (!user) {
      const error = new Error('Aucun utilisateur trouvé avec cet ID.');
      error.statusCode = 404;
      throw error;
    }

    // Mettre à jour l'email et le nom d'utilisateur de l'utilisateur
    if (email) {
      user.email = email;
    }
    if (username) {
      user.username = username;
    }

    // Sauvegarder l'utilisateur mis à jour
    const result = await user.save();

    res.status(200).json({
      message: 'Profil mis à jour avec succès.',
      user: result
    });
  } catch (err) {
    if (err.code === 11000) {
      err = new Error('Un compte possède déjà ce courriel.');
      err.statusCode = 400;
    }
    next(err);
  }
}

exports.updateCar = async (req, res, next) => { 
  const voitureId = req.params.id;
  const updatedCar = req.body;

  try {
    const voiture = await Voiture.findById(voitureId);
    if (!voiture) {
      const error = new Error('Aucune voiture trouvée avec cet ID.');
      error.statusCode = 404;
      throw error;
    }

    // Mettre à jour les champs de la voiture
    for (let key in updatedCar) {
      voiture[key] = updatedCar[key];
    }

    // Sauvegarder la voiture mise à jour
    const result = await voiture.save();

    res.status(200).json({
      message: 'Voiture mise à jour avec succès.',
      voiture: result
    });
  } catch (err) {
    next(err);
  }
}



exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await checkUserExists(userId);
    await user.remove();
    if (user.voiture) {
      const voiture = await Voiture.findById(user.voiture);
      await voiture.remove();
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Fonction pour vérifier si un utilisateur existe
async function checkUserExists(userId) {
  const user = await User.findById(userId).populate('voiture');
  if (!user) {
    const error = new Error('L\'utilisateur n\'existe pas.');
    error.statusCode = 404;
    throw error;
  }
  return user;
}