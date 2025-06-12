function validateRegister(data) {
  const errors = [];

  // Validar nombre
  if (!data.nombre || typeof data.nombre !== 'string') {
    errors.push("El nombre completo es requerido");
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(data.nombre)) {
    errors.push("El nombre completo solo debe contener letras");
  }

  // Validar cédula
  if (!data.cedula) {
    errors.push("La cédula es requerida");
  } else if (!/^\d{7,8}$/.test(data.cedula)) {
    errors.push("Debe ingresar una cédula de identidad válida");
  }

  // Validar teléfono
  if (!data.telefono || typeof data.telefono !== 'string') {
    errors.push("El número de teléfono es requerido");
  } else if (!/^((0)|(\+58))4((12)|(14)|(16)|(24)|(26))\d{7}$/.test(data.telefono)) {
    errors.push("Ingrese un número de teléfono válido");
  }

  // Validar correo
  if (!data.correo) {
    errors.push("El correo es requerido");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
    errors.push("Debe ser un correo electrónico válido");
  }

  // Validar password
  if (!data.password || typeof data.password !== 'string') {
    errors.push("La contraseña es requerida");
  }

  return errors;
}

module.exports = validateRegister;
