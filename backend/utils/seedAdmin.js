const User = require("../models/user");
const bcrypt = require("bcryptjs");

async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    const existingAdmin = await User.findOne({ correo: adminEmail });

    if (existingAdmin) {
      console.log("✅ El administrador ya existe");
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    const admin = new User({
      nombre: process.env.ADMIN_NOMBRE,
      cedula: process.env.ADMIN_CEDULA,
      direccion: process.env.ADMIN_DIRECCION,
      telefono: process.env.ADMIN_TELEFONO,
      correo: adminEmail,
      password: hashedPassword,
      rol: "admin",
    });

    await admin.save();
    console.log("Administrador creado correctamente");
  } catch (error) {
    console.error("Error creando administrador:", error);
  }
}

module.exports = seedAdmin;
