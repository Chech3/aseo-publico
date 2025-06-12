const Pago = require('../models/pago');
const User = require('../models/user');  // <-- este te faltaba

exports.registrarPago = async (req, res) => {
  try {
    const { referencia, cedula, nombre, correo, metodo, monto } = req.body;

    const usuarioId = req.user.id; // lo tomamos desde el token


    // Asegúrate de que `req.file` exista (esto viene de multer)
    if (!req.file) {
      return res.status(400).json({ message: "Comprobante no cargado" });
    }

    // Guardamos la ruta del archivo (relativa o completa)
    const rutaComprobante = `/uploads/${req.file.filename}`;

    const nuevoPago = new Pago({
      usuario: usuarioId, // Relacionamos el pago con el usuario autenticado
      monto,
      referencia,
      cedula,
      nombre,
      correo,
      metodo,
      comprobante: rutaComprobante,
      fecha: new Date(),
    });

    await nuevoPago.save();

    // Actualizamos el saldo
    const user = await User.findById(usuarioId);
    if (user) {
      user.deuda = (user.deuda || 0) - monto;
      await user.save();
    }

    res.status(201).json({ message: "Pago registrado", pago: nuevoPago });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el pago" });
  }
};
