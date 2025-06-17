const Pago = require('../models/pago');
const User = require('../models/user');  // <-- este te faltaba

exports.registrarPago = async (req, res) => {
  try {
    const { referencia, cedula, nombre, correo, metodo, monto } = req.body;
    const usuarioId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "Comprobante no cargado" });
    }

    // Reemplazar espacios en el nombre del archivo
    const original = req.file.originalname.replace(/\s+/g, "_");
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${original}`;
    const rutaComprobante = `/uploads/${filename}`;

    // Renombrar el archivo guardado (porque multer ya lo subió con otro nombre)
    const fs = require("fs");
    const path = require("path");
    const oldPath = path.join(__dirname, "..", "uploads", req.file.filename);
    const newPath = path.join(__dirname, "..", "uploads", filename);
    fs.renameSync(oldPath, newPath);

    const nuevoPago = new Pago({
      usuario: usuarioId,
      monto,
      referencia,
      cedula,
      nombre,
      correo,
      metodo,
      estado: 'pendiente',
      comprobante: rutaComprobante,
      fecha: new Date(),
    });

    await nuevoPago.save();
    res.status(201).json({ message: "Pago registrado", pago: nuevoPago });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el pago" });
  }
};
