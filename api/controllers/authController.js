const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/user");
const Car = require("../models/voiture");


exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "L'utilisateur n'existe pas" });
      }

      // Chercher la voiture de l'utilisateur
      Car.findById(user.voiture)
        .then((car) => {
          // Comparer le mot de passe entré avec le mot de passe haché stocké
          bcrypt
            .compare(password, user.password)
            .then((isMatch) => {
              if (!isMatch) {
                return res.status(401).json({ message: "Mot de passe incorrect" });
              }

              // Si le mot de passe est correct, générer un token JWT
              const token = jwt.sign(
                {
                  userId: user._id,
                  email: user.email,
                  username: user.username,
                  isValet: user.isValet,
                  price: user.price,
                  voiture: user.voiture, 
                  maVoiture: car,
                },
                process.env.SECRET_JWT,
                {
                  expiresIn: "24h",
                }
              );

              // Envoyer le token dans la réponse
              res.status(200).json({ token });
            })
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

exports.signup = (req, res, next) => {
  const { email, username, password, confirmPassword } = req.body;

  // Vérifier si le mot de passe et le mot de passe de confirmation correspondent
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
  }

  // Vérifier si l'utilisateur existe déjà
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ message: "L'utilisateur existe déjà" });
      }

      // Hacher le mot de passe et créer un nouvel utilisateur
      bcrypt.hash(password, 10)
        .then((hashedPassword) => {
          const newUser = new User({
            email,
            username,
            password: hashedPassword,
            isValet: false,
            price: 0,
            voiture: null,
          });

          newUser.save()
            .then(() => res.status(201).json({ message: "Compte crée avec succès!" }))
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};


exports.updateProfile = (req, res, next) => {
  const userId = req.params.userId;
  const { email, username, userChange, carChange, marque, modele, couleur, plaque } = req.body;

  User.findById(userId)
      .then((user) => {
          if (!user) {
              return res.status(404).json({ message: "L'utilisateur n'existe pas" });
          }

          if (userChange) {
            user.username = username;
            user.email = email;
            return user.save();
          }

          return Promise.resolve(user);
      })
      .then((updatedUser) => {
          return Car.findById(updatedUser.voiture)
              .then((car) => {
                  if (carChange) {
                    if (car) {
                      car.marque = marque;
                      car.modele = modele;
                      car.couleur = couleur;
                      car.plaque = plaque;
                      return car.save().then(updatedCar => [updatedCar, updatedUser]);
                    } else {
                      const newCar = new Car({
                        marque,
                        modele,
                        couleur,
                        plaque,
                        isParked: false,
                        isMoving: false,
                        latitude: 0,
                        longitude: 0,
                        timeToLeave: Date.now()
                      });

                      updatedUser.voiture = newCar._id;
                      return Promise.all([newCar.save(), updatedUser.save()]);
                    }
                  }
                  return Promise.resolve([car, updatedUser]);
              })
              .then(([updatedCar, updatedUser]) => {
                  const token = jwt.sign(
                      {
                          userId: updatedUser._id,
                          email: updatedUser.email,
                          username: updatedUser.username,
                          isValet: updatedUser.isValet,
                          price: updatedUser.price,
                          voiture: updatedUser.voiture,
                          maVoiture: updatedCar,
                      },
                      process.env.SECRET_JWT,
                      {
                          expiresIn: "24h",
                      }
                  );

                  res.status(200).json({ token, user: updatedUser, voiture: updatedCar });
              });
      })
      .catch((err) => next(err));
};


exports.updateProfileValet = (req, res, next) => {
  const userId = req.params.userId;
  const { email, username, price } = req.body;

  User.findById(userId)
      .then((user) => {
          if (!user) {
              return res.status(404).json({ message: "L'utilisateur n'existe pas" });
          }

          user.username = username;
          user.email = email;
          user.price = price;
          
          return user.save();
      })
      .then((updatedUser) => {
          const token = jwt.sign(
              {
                  userId: updatedUser._id,
                  email: updatedUser.email,
                  username: updatedUser.username,
                  isValet: updatedUser.isValet,
                  price: updatedUser.price,
                  voiture: updatedUser.voiture,
              },
              process.env.SECRET_JWT,
              {
                  expiresIn: "24h",
              }
          );

          res.status(200).json({ token, user: updatedUser });
      })
      .catch((err) => next(err));
};