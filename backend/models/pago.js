// models/pago.js
const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
  referencia: {
    type: String,
    required: true,
  },
  comprobante: {
    type: String, // si es una URL al archivo o nombre del archivo
    required: true,
  },
  cedula: {
    type: String,
    required: true,
  },
  nombre: String,
  email: String,
  metodo: String,
  fecha: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Pago', pagoSchema);
