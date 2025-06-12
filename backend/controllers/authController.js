// controllers/authController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegister = require('../validators/registerValidator');
exports.register = async (req, res) => {
  try {
    const { nombre, cedula, direccion, telefono, password, correo } = req.body;


    const errors = validateRegister(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Errores de validación', errors });
    }

    const existingCedula = await User.findOne({ cedula });
    if (existingCedula) {
      return res.status(400).json({ message: 'La cédula ya está registrada' });
    }

    const existingUser = await User.findOne({
      $or: [{ correo }, { telefono }]
    });
    if (existingUser) {
      let conflictField = '';
      if (existingUser.correo === correo) conflictField = 'correo';
      else if (existingUser.telefono === telefono) conflictField = 'teléfono';

      return res.status(400).json({ message: `El ${conflictField} ya está registrado en nuestro sistema` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      nombre,
      cedula,
      direccion,
      telefono,
      correo,
      saldo: 0,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { cedula, password } = req.body;

    const user = await User.findOne({ cedula });
    if (!user) {
      return res.status(400).json({ message: 'Cédula no registrada' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, user: { nombre: user.nombre, cedula: user.cedula, direccion: user.direccion, telefono: user.telefono, correo: user.correo, rol: user.rol } });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};
