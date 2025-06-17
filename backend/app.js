const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // ✅ importar cors
const authRoutes = require('./routes/auth');
const pagosRoutes = require('./routes/pagos');
const quejasRoutes = require('./routes/queja');
const seedAdmin = require('./utils/seedAdmin');
const path = require("path");
dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Conectado a MongoDB");

    await seedAdmin();

    app.listen(3001, () => {
      console.log("Servidor corriendo en puerto 3001");
    });
  })
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/quejas', quejasRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
