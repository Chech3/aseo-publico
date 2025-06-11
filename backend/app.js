// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // ✅ importar cors
const authRoutes = require('./routes/auth');
const pagosRoutes = require('./routes/pagos');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // o el dominio de tu frontend
  credentials: true,
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexión a MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/pagos', pagosRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
