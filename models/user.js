const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  /*role: { type: String, enum: ['citizen', 'operator'], default: 'citizen' }*/
}, { timestamps: true });

const Utente = mongoose.model('User', userSchema);

module.exports = Utente;