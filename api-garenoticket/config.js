require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  SECRET_JWT: process.env.SECRET_JWT,
  URL: process.env.URL,
};