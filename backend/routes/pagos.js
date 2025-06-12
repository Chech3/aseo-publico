const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middlewares/authMiddleware');
const { registrarPago } = require('../controllers/pagoController');
const User = require('../models/user');
const pago = require('../models/pago');

// Configura dónde y cómo guardar archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Asegúrate de que esta carpeta exista
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage });


// Aquí usas multer solo en esta ruta
router.post('/registrar', authMiddleware, upload.single('comprobante'), registrarPago);


router.get('/estado-cuenta', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('nombre deuda');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const pagos = await pago.find({ usuario: req.user.id });

    // Sumamos los pagos realizados
    const totalPagado = pagos.reduce((sum, p) => sum + p.monto, 0);

    res.json({
      nombre: user.nombre,
      deudaActual: user.deuda,
      totalPagado: totalPagado,
      saldoRestante: user.deuda, // O puedes hacer alguna fórmula aquí si lo deseas.
      pagos: pagos, // Si quieres enviar detalle de los pagos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estado de cuenta' });
  }
});

module.exports = router;