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


export async function getTodosLosClientesCantidad(token: string) {
  const res = await fetch("http://localhost:3001/api/pagos/admin/cantidad", {
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

export async function getTodosLosDeudores(token:string) {
 const res = await fetch("http://localhost:3001/api/pagos/admin/cantidad-deudores", {
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


export async function getPagosHoy(token:string) {
 const res = await fetch("http://localhost:3001/api/pagos/admin/cantidad-pagos-hoy", {
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