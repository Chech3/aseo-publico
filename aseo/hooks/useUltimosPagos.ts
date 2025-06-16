export async function getUltimosPagos(token: string) {
  const response = await fetch("http://localhost:3001/api/pagos/ultimos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error al obtener los pagos");
  }
  
  const data = await response.json();
  console.log(data.pagos);
  return data;
}
