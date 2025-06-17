const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cedula: { type: String, required: true, unique: true },
  direccion: { type: String, required: true },
  telefono: { type: String, required: true },
  correo: { type: String, required: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'user'], default: 'user' },
  saldo: {
    type: Number,
    default: 0, // suponiendo que parte sin deuda
  },
  deuda: { type: Number, default: 0 },
  tarifaMensual: { type: Number, default: 25 },  // cada uno su tarifa
  saldoAFavor: { type: Number, default: 0 },

});

module.exports = mongoose.model('User', userSchema);
