const Pago = require('../models/Pago');
exports.registrarPago = async (req, res) => {
  try {
    const { referencia, cedula, nombre, correo } = req.body;

    // Asegúrate de que `req.file` exista (esto viene de multer)
    if (!req.file) {
      return res.status(400).json({ message: "Comprobante no cargado" });
    }

    // Guardamos la ruta del archivo (relativa o completa)
    const rutaComprobante = `/uploads/${req.file.filename}`;

    const nuevoPago = new Pago({
      referencia,
      cedula,
      nombre,
      correo,
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
