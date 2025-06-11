"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart } from "recharts"

const monthlyData = [
  { name: "Ene", ingresos: 2400000, clientes: 45 },
  { name: "Feb", ingresos: 2800000, clientes: 48 },
  { name: "Mar", ingresos: 3200000, clientes: 52 },
  { name: "Abr", ingresos: 2900000, clientes: 50 },
  { name: "May", ingresos: 3500000, clientes: 55 },
  { name: "Jun", ingresos: 4200000, clientes: 58 },
]

const dailyPayments = [
  { day: "Lun", pagos: 12 },
  { day: "Mar", pagos: 19 },
  { day: "Mié", pagos: 15 },
  { day: "Jue", pagos: 22 },
  { day: "Vie", pagos: 18 },
  { day: "Sáb", pagos: 8 },
  { day: "Dom", pagos: 5 },
]

export function AdminOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Ingresos mensuales</CardTitle>
          <CardDescription>Evolución de los ingresos por servicios de aseo</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Ingresos"]}
                labelFormatter={(label) => `Mes: ${label}`}
              />
              <Bar dataKey="ingresos" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-green-600" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Pagos por día</CardTitle>
          <CardDescription>Distribución de pagos en la semana actual</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={dailyPayments}>
              <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
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
  )
}
