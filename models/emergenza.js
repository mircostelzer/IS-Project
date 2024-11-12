// models.js
const mongoose = require('mongoose');

const emergenzaSchema = new mongoose.Schema({
  titolo: { type: String, required: true },
  categoria: { type: String, required: true },
  dataInizio: { type: Date, required: true },
  dataFine: { type: Date },
  luogo: { type: String, required: true },
  stato: { type: String, enum: ['in_corso', 'terminata'], default: 'in_corso' },
  descrizione: { type: String }
}, { timestamps: true });


const Emergenza = mongoose.model('Emergenza', emergenzaSchema);

module.exports = Emergenza;
