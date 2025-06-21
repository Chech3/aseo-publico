const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middlewares/authMiddleware');
const { registrarPago, eliminarPago } = require('../controllers/pagoController');
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
    const user = await User.findById(req.user.id).select('nombre deuda saldoAFavor');

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
      saldoRestante: user.saldoAFavor,
      pagos: pagos, // Si quieres enviar detalle de los pagos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estado de cuenta' });
  }
});

router.delete('/admin/pagos/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos' });
    }

    const { id } = req.params;
    const pagoEliminado = await pago.findByIdAndDelete(id);

    if (!pagoEliminado) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    res.json({ message: 'Pago eliminado correctamente', pago: pagoEliminado });
  } catch (error) {
    console.error('Error al eliminar el pago:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
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
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos' });
    }

    const { id } = req.params;
    const { monto, estado, metodo, comprobante } = req.body;

    if (!monto || !estado || !metodo) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const pagoActualizado = await pago.findByIdAndUpdate(
      id,
      { monto, estado, metodo, comprobante },
      { new: true }
    );

    if (!pagoActualizado) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    if (estado === 'completado') {
      const user = await User.findById(pagoActualizado.usuario);

      if (user) {
        let deudaActual = user.deuda || 0;
        let saldoAFavor = user.saldoAFavor || 0;
        let montoPago = Number(monto);

        // Paso 1: aplicar saldoAFavor *primero* a la deuda
        if (deudaActual > 0 && saldoAFavor > 0) {
          if (saldoAFavor >= deudaActual) {
            saldoAFavor -= deudaActual;
            deudaActual = 0;
          } else {
            deudaActual -= saldoAFavor;
            saldoAFavor = 0;
          }
        }

        // Paso 2: aplicar el monto del pago a la deuda restante
        if (montoPago >= deudaActual) {
          const excedente = montoPago - deudaActual;
          deudaActual = 0;
          saldoAFavor += excedente;
        } else {
          deudaActual -= montoPago;
        }

        // Guardar los valores finales
        user.deuda = deudaActual;
        user.saldoAFavor = saldoAFavor;

        await user.save();
      }
    }

    res.json({ message: 'Pago actualizado correctamente', pago: pagoActualizado });
  } catch (error) {
    console.error('Error al actualizar el pago:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/admin/usuarios', authMiddleware, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }

    const usuarios = await User.find().select('-password');
    res.json({ usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.put('/admin/usuarios/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }

    const { id } = req.params;
    const { nombre, cedula, direccion, telefono, correo, deuda, saldoAFavor } = req.body;

    // Validaciones simples
    if (!nombre || !cedula || !telefono || !correo || !deuda ) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Lógica para aplicar saldoAFavor si hay nueva deuda
    let nuevaDeuda = Number(deuda);
    let nuevoSaldoAFavor = Number(saldoAFavor ?? user.saldoAFavor);

    if (nuevaDeuda > 0 && nuevoSaldoAFavor > 0) {
      if (nuevoSaldoAFavor >= nuevaDeuda) {
        nuevoSaldoAFavor -= nuevaDeuda;
        nuevaDeuda = 0;
      } else {
        nuevaDeuda -= nuevoSaldoAFavor;
        nuevoSaldoAFavor = 0;
      }
    }

    // Actualización final
    const userActualizado = await User.findByIdAndUpdate(
      id,
      {
        nombre,
        cedula,
        direccion,
        telefono,
        correo,
        deuda: nuevaDeuda,
        saldoAFavor: nuevoSaldoAFavor,
      },
      { new: true }
    ).select('-password');

    res.json({ message: 'Usuario actualizado correctamente', usuario: userActualizado });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


module.exports = router;