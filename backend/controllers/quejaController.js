const Queja = require('../models/queja');

exports.registrarQueja = async (req, res) => {
  try {
    const { nombre, correo, telefono, tipoQueja, descripcion, solucionEsperada, fechaIncidente } = req.body;

    // Comprobante es opcional
    let rutaComprobante = null;
    if (req.file) {
      rutaComprobante = `/uploads/${req.file.filename}`;
    }

    const nuevaQueja = new Queja({
      nombre,
      correo,
      telefono,
      tipoQueja,
      descripcion,
      solucionEsperada,
      fechaIncidente,
      comprobante: rutaComprobante,
    });

    await nuevaQueja.save();

    res.status(201).json({ message: "Queja registrada", queja: nuevaQueja });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar la queja" });
  }
};
