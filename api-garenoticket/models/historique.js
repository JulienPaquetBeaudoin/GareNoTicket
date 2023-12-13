const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historiqueSchema = new Schema(
  {
    price: {
      type: Number,
      
    },
    isPaid: {
      type: Boolean,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    valetId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Historique', historiqueSchema);
