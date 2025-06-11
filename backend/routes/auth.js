// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/register', register);
router.post('/login', login);


router.get('/admin', authMiddleware, roleMiddleware('admin'), (req, res) => {
  res.json({
    message: 'Bienvenido al panel de administración',
    usuario: req.user,
  });
});

module.exports = router;
