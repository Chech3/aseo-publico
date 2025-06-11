const express = require('express');
const router = express.Router();
const multer = require('multer');

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

const { registrarQueja } = require('../controllers/quejaController');

// Ruta para registrar quejas
router.post('/registrar', upload.single('comprobante'), registrarQueja);

module.exports = router;
