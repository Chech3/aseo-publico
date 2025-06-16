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


router.get('/ultimos', authMiddleware, async (req, res) => {
  try {
    const pagos = await pago.find({ usuario: req.user.id })
      .sort({ fecha: -1 })
      .limit(5)
      .lean(); // importante para obtener objetos JS planos

    const pagosFormateados = pagos.map(pago => ({
      id: pago._id,
      monto: pago.monto,
      fecha: pago.fecha,
      comprobante: pago.comprobante ?? '',
      estado: pago.estado ?? 'completado',
      metodo: pago.metodo ?? 'Pago móvil',
    }));

    res.json({ pagos: pagosFormateados });

  } catch (error) {
    console.error('Error al obtener últimos pagos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/admin/todos', authMiddleware, async (req, res) => {
  try {
    // Validación de permisos solo para administradores
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }

    const pagos = await pago.find()
      .populate('usuario', 'nombre cedula correo telefono') // Trae los datos del usuario
      .sort({ fecha: -1 });

    res.json({ pagos });
  } catch (error) {
    console.error('Error al obtener todos los pagos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


router.put('/admin/actualizar/:id', authMiddleware, async (req, res) => {
  try {
    // Validación básica de rol (esto es opcional si ya tienes validación de roles)
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }

    const { id } = req.params;
    const { monto, estado, metodo, comprobante } = req.body;

    // Validación simple de los campos
    if (!monto || !estado || !metodo) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const allowedEstados = ['pendiente', 'completado', 'rechazado'];
    if (!allowedEstados.includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const pagoActualizado = await pago.findByIdAndUpdate(
      id,
      { monto, estado, metodo, comprobante },
      { new: true }
    );

    if (!pagoActualizado) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    res.json({ message: 'Pago actualizado correctamente', pago: pagoActualizado });
  } catch (error) {
    console.error('Error al actualizar el pago:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;