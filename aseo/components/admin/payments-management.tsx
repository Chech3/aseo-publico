"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Download, Search, Filter } from "lucide-react"
import { useState } from "react"

interface Payment {
  id: string
  clientName: string
  billNumber: string
  amount: number
  paymentDate: string
  paymentMethod: string
  transactionId: string
  status: "completed" | "pending" | "failed"
}

const demoPayments: Payment[] = [
  {
    id: "1",
    clientName: "María González",
    billNumber: "ASE-2025-001",
    amount: 150000,
    paymentDate: "2025-06-07",
    paymentMethod: "Tarjeta de crédito",
    transactionId: "TXN-001234",
    status: "completed",
  },
  {
    id: "2",
    clientName: "Carlos Rodríguez",
    billNumber: "ASE-2025-002",
    amount: 300000,
    paymentDate: "2025-06-06",
    paymentMethod: "Transferencia bancaria",
    transactionId: "TXN-001235",
    status: "completed",
  },
  {
    id: "3",
    clientName: "Ana Martínez",
    billNumber: "ASE-2025-003",
    amount: 120000,
    paymentDate: "2025-06-05",
    paymentMethod: "Pago móvil",
    transactionId: "TXN-001236",
    status: "pending",
  },
]

export function PaymentsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return "success"
      case "pending":
        return "warning"
      case "failed":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusText = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "pending":
        return "Pendiente"
      case "failed":
        return "Fallido"
      default:
        return status
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const filteredPayments = demoPayments.filter((payment) => {
    const matchesSearch =
      payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalAmount = filteredPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pagos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="failed">Fallidos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros avanzados
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Total recaudado (filtrado)</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Pagos completados</p>
            <p className="text-lg font-semibold">{filteredPayments.filter((p) => p.status === "completed").length}</p>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Factura</TableHead>
              <TableHead>Fecha y hora</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>ID Transacción</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.clientName}</TableCell>
                <TableCell>{payment.billNumber}</TableCell>
                <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell className="font-mono text-sm">{payment.transactionId}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(payment.status) as any}>{getStatusText(payment.status)}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
