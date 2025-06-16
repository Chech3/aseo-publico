export async function getTodosLosPagos(token: string) {
  const res = await fetch("http://localhost:3001/api/pagos/admin/todos", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al cargar los pagos");
  }

  return res.json();
}