const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registrarQueja, obtenerTodasLasQuejas  } = require('../controllers/quejaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Configuración de Multer (reutilizamos la misma de pagos)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage });


// Ruta para registrar quejas
router.post('/registrar', upload.single('comprobante'), registrarQueja);
router.get('/quejas', obtenerTodasLasQuejas);

module.exports = router;
