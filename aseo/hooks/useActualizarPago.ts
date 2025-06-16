export async function actualizarPagoAdmin(token: string, pagoId: string, data: {
  monto: number;
  estado: string;
  metodo: string;
  comprobante?: string;
}) {
  const response = await fetch(`http://localhost:3001/api/pagos/admin/actualizar/${pagoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Error al actualizar el pago");
  }

  return result;
}
