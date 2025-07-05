"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useMonthlyChartData,
  useWeeklyPaymentsChartData,
} from "@/hooks/usedashboardData";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
} from "recharts";

export function AdminOverview() {
  const { data: monthlyData, loading: loadingMonthly } = useMonthlyChartData();
  const { data: dailyPayments, loading: loadingDaily } =
    useWeeklyPaymentsChartData();

  if (loadingMonthly || loadingDaily)
    return <p className="p-4">Cargando datos...</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Ingresos mensuales</CardTitle>
          <CardDescription>
            Evolución de los ingresos por servicios de aseo
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  "Ingresos",
                ]}
                labelFormatter={(label) => `Mes: ${label}`}
              />
              <Bar
                dataKey="ingresos"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-green-600"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Pagos por día</CardTitle>
          <CardDescription>
            Distribución de pagos en la semana actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={dailyPayments}>
              <XAxis
                dataKey="day"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value: number) => [`${value}`, "Pagos"]}
                labelFormatter={(label) => `Día: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="pagos"
                stroke="currentColor"
                strokeWidth={2}
                className="stroke-green-600"
                dot={{ fill: "currentColor", className: "fill-green-600" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
