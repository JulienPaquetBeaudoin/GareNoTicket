const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const factureSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Facture', factureSchema);
