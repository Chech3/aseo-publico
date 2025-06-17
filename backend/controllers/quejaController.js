const Queja = require('../models/queja');

exports.registrarQueja = async (req, res) => {
  try {
    const { nombre, correo, telefono, tipoQueja, descripcion, solucionEsperada, fechaIncidente } = req.body;
    // const usuarioId = req.user.id;

    let rutaComprobante = null;
    if (req.file) {
      rutaComprobante = `/uploads/${req.file.filename}`;
    }

    const nuevaQueja = new Queja({
      // usuario: usuarioId,  // <- nueva línea
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

exports.obtenerTodasLasQuejas = async (req, res) => {
  try {
    const quejas = await Queja.find().sort({ fecha: -1 }) // ordena por fecha descendente
    res.status(200).json(quejas)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error al obtener las quejas" })
  }
}
