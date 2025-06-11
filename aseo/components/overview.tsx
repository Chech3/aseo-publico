"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Ene",
    total: 2400,
  },
  {
    name: "Feb",
    total: 1800,
  },
  {
    name: "Mar",
    total: 2200,
  },
  {
    name: "Abr",
    total: 1600,
  },
  {
    name: "May",
    total: 3050,
  },
  {
    name: "Jun",
    total: 850,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip formatter={(value: number) => [`$${value}`, "Total"]} labelFormatter={(label) => `Mes: ${label}`} />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-green-600" />
      </BarChart>
    </ResponsiveContainer>
  )
}
