import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Queja {
_id: string
tipoQueja: string
nombre: string
descripcion: string
fecha: string
comprobante?: string
telefono: string,
solucionEsperada?: string,
}

export function useQuejas() {
  const [quejas, setQuejas] = useState<Queja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  
  useEffect(() => {
    async function fetchQuejas() {
      try {
        const res = await fetch("http://localhost:3001/api/quejas/quejas");

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Error al cargar quejas");
        }

        const data = await res.json();
        setQuejas(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchQuejas();
  }, []);

  return { quejas, loading, error };
}
