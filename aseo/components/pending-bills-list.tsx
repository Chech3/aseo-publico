"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, AlertTriangle, Clock } from "lucide-react"
import { useState } from "react"
import { PaymentModal } from "@/components/payment-modal"

interface PendingBill {
  id: string
  billNumber: string
  description: string
  amount: number
  dueDate: string
  status: "pending" | "overdue" | "due-soon"
  category: string
}

const demoBills: PendingBill[] = [
  {
    id: "1",
    billNumber: "FAC-2025-001",
    description: "Servicio de aseo - Mayo 2025",
    amount: 850.0,
    dueDate: "2025-06-15",
    status: "due-soon",
    category: "Servicios",
  },
  {
    id: "2",
    billNumber: "FAC-2025-002",
    description: "Aseo mensual - Junio 2025",
    amount: 1200.0,
    dueDate: "2025-06-01",
    status: "overdue",
    category: "Cuotas",
  },
  {
    id: "3",
    billNumber: "FAC-2025-003",
    description: "Aseo y mantenimiento - Mayo 2025",
    amount: 400.0,
    dueDate: "2025-05-30",
    status: "overdue",
    category: "Mantenimiento",
  },
  {
    id: "4",
    billNumber: "FAC-2025-004",
    description: "Aseo comercial anual 2025",
    amount: 2400.0,
    dueDate: "2025-07-01",
    status: "pending",
    category: "Seguros",
  },
]

export function PendingBillsList() {
  const [selectedBill, setSelectedBill] = useState<PendingBill | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const getStatusColor = (status: PendingBill["status"]) => {
    switch (status) {
      case "overdue":
        return "destructive"
      case "due-soon":
        return "warning"
      case "pending":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusText = (status: PendingBill["status"]) => {
    switch (status) {
      case "overdue":
        return "Vencida"
      case "due-soon":
        return "Por vencer"
      case "pending":
        return "Pendiente"
      default:
        return status
    }
  }

  const getStatusIcon = (status: PendingBill["status"]) => {
    switch (status) {
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />
      case "due-soon":
        return <Clock className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "COP",
    }).format(amount)
  }

  const handlePayClick = (bill: PendingBill) => {
    setSelectedBill(bill)
    setIsPaymentModalOpen(true)
  }

  const totalPending = demoBills.reduce((sum, bill) => sum + bill.amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div>
          <h3 className="font-semibold">Total pendiente</h3>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalPending)}</p>
        </div>
        <Button
          size="lg"
          className="bg-green-600 hover:bg-green-700"
          onClick={() => {
            // Lógica para pagar todo
            console.log("Pagar todo")
          }}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Pagar todo
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Factura</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demoBills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="font-medium">{bill.billNumber}</TableCell>
                <TableCell>{bill.description}</TableCell>
                <TableCell>{bill.category}</TableCell>
                <TableCell>{formatDate(bill.dueDate)}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(bill.amount)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(bill.status) as any} className="gap-1">
                    {getStatusIcon(bill.status)}
                    {getStatusText(bill.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button onClick={() => handlePayClick(bill)} size="sm" className="bg-green-600 hover:bg-green-700">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pagar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} bill={selectedBill} />
    </div>
  )
}
