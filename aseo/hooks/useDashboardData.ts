import { useEffect, useState } from "react"

const BASE_URL = "http://localhost:3001/api/pagos" 

export function useMonthlyChartData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/admin/grafico-ingresos-mensuales`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
      }
    })
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Error al cargar ingresos mensuales", err))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
export function useWeeklyPaymentsChartData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/admin/grafico-pagos-diarios`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
      }
    })
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Error al cargar pagos diarios", err))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
