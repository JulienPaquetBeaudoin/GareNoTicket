const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Le courriel est requis'],
      unique: true,
      match: [/.+@.+\..+/, 'Adresse courriel invalide'],
      maxlength: [50, 'Le courriel ne doit pas dépasser 50 caractères'],
    },
    username: {
      type: String,
      required: true,
      minlength: [3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'],
      maxlength: [50, 'Le nom d\'utilisateur ne doit pas dépasser 50 caractères'],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    },
    isValet: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      default: 0
    },
    voiture: {
      type: Schema.Types.ObjectId,
      ref: 'Voiture'
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model('User', userSchema);
