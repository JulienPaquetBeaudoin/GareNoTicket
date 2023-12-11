const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voitureSchema = new Schema(
  {
    marque: {
      type: String,
      required: [true, 'La marque est requise'],
      minlength: [1, 'La marque doit contenir au moins 1 caractère'],
      maxlength: [50, 'La marque ne doit pas dépasser 50 caractères'],
    },
    modele: {
      type: String,
      required: [true, 'Le modèle est requis'],
      minlength: [1, 'Le modèle doit contenir au moins 1 caractère'],
      maxlength: [50, 'Le modèle ne doit pas dépasser 50 caractères'],
    },
    couleur: {
      type: String,
      required: [true, 'La couleur est requise'],
      minlength: [3, 'La couleur doit contenir au moins 3 caractères'],
      maxlength: [50, 'La couleur ne doit pas dépasser 50 caractères'],
    },
    plaque: {
      type: String,
      required: [true, 'La plaque est requise'],
      length: [6, 'La plaque doit contenir 6 caractères'],

    },
    valet: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    isParked: {
      type: Boolean,
    },
    isMoving: {
      type: Boolean,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    timeToLeave: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Voiture', voitureSchema);
