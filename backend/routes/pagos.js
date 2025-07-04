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


router.get('/estado-deuda', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const deuda = user.deuda
    const tarifaMensual = user.tarifaMensual

    const deudaCalculada = deuda * tarifaMensual

    const mesesDeuda = user.deuda



    res.json({
      mesesDeuda,
      deudaCalculada,
      saldoAFavor: user.saldoAFavor,
      mensaje: `Debes $${deudaCalculada} porque tienes ${mesesDeuda} mes(es) sin pagar (tarifa mensual: $${tarifaMensual}).`
    });
  } catch (error) {
    console.error("Error al calcular deuda:", error);
    res.status(500).json({ message: "Error interno al calcular la deuda" });
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


router.get('/admin/cantidad', authMiddleware, async (req, res) => {
  try {
    // Solo administradores pueden acceder
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }

    // Cuenta usuarios cuyo rol NO sea 'admin'
    const cantidadUsuarios = await User.countDocuments({ rol: { $ne: 'admin' } });

    res.json({ cantidad: cantidadUsuarios });
  } catch (error) {
    console.error('Error al obtener cantidad de usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/admin/cantidad-pagos-hoy', authMiddleware, async (req, res) => {
  try {
    // Solo administradores pueden acceder
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }

    // Definir el rango del día de hoy
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date();
    finDia.setHours(23, 59, 59, 999);

    // Buscar pagos realizados hoy
    const cantidadPagosHoy = await pago.countDocuments({
      fecha: { $gte: inicioDia, $lte: finDia },
      estado: 'completado' // opcional: solo contar los pagos confirmados
    });

    res.json({ cantidad: cantidadPagosHoy });
  } catch (error) {
    console.error('Error al obtener cantidad de pagos de hoy:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


router.get('/admin/grafico-ingresos-mensuales', authMiddleware, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos' });
    }
    const yearNow = new Date().getFullYear();

    const resultados = await pago.aggregate([
  {
    $match: {
      estado: 'completado',
      fecha: {
        $gte: new Date(`${yearNow}-01-01T00:00:00Z`),
        $lte: new Date(`${yearNow}-12-31T23:59:59Z`)
      }
    }
  },
  {
    $group: {
      _id: { mes: { $month: "$fecha" } },
      ingresos: { $sum: "$monto" },
      clientes: { $addToSet: "$usuario" }
    }
  },
  {
    $project: {
      name: { $arrayElemAt: [["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"], { $subtract: ["$_id.mes", 1] }] },
      ingresos: 1,
      clientes: { $size: "$clientes" }
    }
  },
  { $sort: { "_id.mes": 1 } }
]);

    res.json(resultados);
  } catch (error) {
    console.error('Error en gráfico mensual:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


router.get('/admin/grafico-pagos-diarios', authMiddleware, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos' });
    }

    const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay()); // domingo

    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6); // sábado

    const resultados = await pago.aggregate([
      {
        $match: {
          estado: 'completado',
          fecha: {
            $gte: new Date(inicioSemana.setHours(0, 0, 0, 0)),
            $lte: new Date(finSemana.setHours(23, 59, 59, 999))
          }
        }
      },
      {
        $group: {
          _id: { dia: { $dayOfWeek: "$fecha" } },
          pagos: { $sum: 1 }
        }
      },
      {
        $project: {
          day: { $arrayElemAt: [dias, { $subtract: ["$_id.dia", 1] }] },
          pagos: 1
        }
      },
      { $sort: { "_id.dia": 1 } }
    ]);

    res.json(resultados);
  } catch (error) {
    console.error('Error en gráfico diario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});



router.get('/admin/cantidad-deudores', authMiddleware, async (req, res) => {
  try {
    // Validación para asegurar que solo admin acceda
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }

    // Cuenta usuarios con deuda mayor a 0
    const cantidadDeudores = await User.countDocuments({ deuda: { $gt: 0 } });

    res.json({ cantidad: cantidadDeudores });
  } catch (error) {
    console.error('Error al obtener cantidad de deudores:', error);
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


router.post('/admin/facturar', authMiddleware, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para facturar' });
    }

    const usuarios = await User.find({ rol: { $ne: 'admin' } });

    let actualizados = 0;

    for (const usuario of usuarios) {
      const monto = usuario.tarifaMensual || 1; // Puedes dejar fijo si quieres

      usuario.deuda = (usuario.deuda || 0) + monto;

      // Si tiene saldoAFavor, descontarlo directamente
      if (usuario.saldoAFavor && usuario.saldoAFavor > 0) {
        const aplicar = Math.min(usuario.deuda, usuario.saldoAFavor);
        usuario.deuda -= aplicar;
        usuario.saldoAFavor -= aplicar;
      }

      await usuario.save();
      actualizados++;
    }

    res.json({ message: `Facturación completada para ${actualizados} usuarios.` });
  } catch (error) {
    console.error('Error al facturar:', error);
    res.status(500).json({ message: 'Error interno al facturar' });
  }
});


module.exports = router;