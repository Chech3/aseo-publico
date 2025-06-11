const express = require('express');
const router = express.Router();
const multer = require('multer');

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

const { registrarPago } = require('../controllers/pagoController');

// Aquí usas multer solo en esta ruta
router.post('/registrar', upload.single('comprobante'), registrarPago);

module.exports = router;