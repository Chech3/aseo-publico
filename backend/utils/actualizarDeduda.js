const asignarDeuda = async (user, montoDeuda) => {
  const saldoAFavor = user.saldoAFavor || 0;
  let deudaFinal = montoDeuda;

  if (saldoAFavor > 0) {
    if (saldoAFavor >= montoDeuda) {
      deudaFinal = 0;
      user.saldoAFavor = saldoAFavor - montoDeuda;
    } else {
      deudaFinal = montoDeuda - saldoAFavor;
      user.saldoAFavor = 0;
    }
  }

  user.deuda = (user.deuda || 0) + deudaFinal;
  await user.save();
};

module.exports = asignarDeuda;
