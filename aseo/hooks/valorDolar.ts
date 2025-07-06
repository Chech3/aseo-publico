// 

export async function getDolar() {
  const res = await fetch("http://localhost:3001/api/dolar", {
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al cargar los usuarios");
  }

  return res.json();
}