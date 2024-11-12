const mongoose = require('mongoose');

const utenteSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  /*role: { type: String, enum: ['cittadino', 'operatore'], default: 'cittadino' }*/
}, { timestamps: true });

const Utente = mongoose.model('Utente', utenteSchema);

module.exports = Utente;