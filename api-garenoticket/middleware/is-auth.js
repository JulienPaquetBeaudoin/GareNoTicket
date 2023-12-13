const jwt = require('jsonwebtoken');
const config = require('../config');

const SECRET_JWT = config.SECRET_JWT;

/** Vérifie si la requête a un token JWT valide */
module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.status(401).send({ error: 'Non authentifié..' });
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, SECRET_JWT);
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Non authentifié.');
    error.statusCode = 401;
    throw error;
  }
  // Passe le token décodé dans la requête pour pouvoir l'utiliser ailleurs
  req.user = decodedToken;
  next();
};
