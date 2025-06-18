/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getTodosLosClientes(token: string) {
  const res = await fetch("http://localhost:3001/api/pagos/admin/usuarios", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al cargar los usuarios");
  }

  return res.json();
}

export async function actualizarUsuario(id: string, data: any, token: string) {
  const res = await fetch(`http://localhost:3001/api/pagos/admin/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al actualizar usuario");
  }

  return res.json();
}