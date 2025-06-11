// controllers/authController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nombre, cedula, direccion, telefono, password, correo } = req.body;

    const existingUser = await User.findOne({ cedula });
    if (existingUser) {
      return res.status(400).json({ message: 'La cédula ya está registrada' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      nombre,
      cedula,
      direccion,
      telefono,
      correo,
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
