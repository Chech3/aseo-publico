// models/pago.js
const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Relacionamos con el usuario
  monto: {
    type: Number,
    required: true,
  },
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
  estado: {
    type: String,
    enum: ['pendiente', 'completado', 'rechazado'],
    default: 'pendiente',
  },
});

module.exports = mongoose.model('Pago', pagoSchema);
