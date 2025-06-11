const mongoose = require("mongoose");

const quejaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  tipoQueja: { type: String, required: true },
  descripcion: { type: String, required: true },
  solucionEsperada: { type: String },
  comprobante: { type: String }, // ruta del archivo, opcional
  fechaIncidente: { type: Date, required: false },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("queja", quejaSchema);
