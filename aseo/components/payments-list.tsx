import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

interface Payment {
  id: string
  date: string
  amount: number
  description: string
  status: "pending" | "approved" | "rejected"
  reference: string
}

const demoPayments: Payment[] = [
  {
    id: "1",
    date: "2025-06-01",
    amount: 1500,
    description: "Pago de factura #12345",
    status: "approved",
    reference: "REF-001",
  },
  {
    id: "2",
    date: "2025-05-28",
    amount: 750,
    description: "Pago de servicios",
    status: "approved",
    reference: "REF-002",
  },
  {
    id: "3",
    date: "2025-05-25",
    amount: 2200,
    description: "Pago de alquiler",
    status: "pending",
    reference: "REF-003",
  },
  {
    id: "4",
    date: "2025-05-20",
    amount: 350,
    description: "Pago de internet",
    status: "approved",
    reference: "REF-004",
  },
  {
    id: "5",
    date: "2025-05-15",
    amount: 1800,
    description: "Pago de préstamo",
    status: "rejected",
    reference: "REF-005",
  },
  {
    id: "6",
    date: "2025-05-10",
    amount: 950,
    description: "Pago de seguro",
    status: "approved",
    reference: "REF-006",
  },
  {
    id: "7",
    date: "2025-05-05",
    amount: 500,
    description: "Pago de teléfono",
    status: "approved",
    reference: "REF-007",
  },
]

interface PaymentsListProps {
  limit?: number
}

export function PaymentsList({ limit }: PaymentsListProps) {
  const payments = limit ? demoPayments.slice(0, limit) : demoPayments

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "approved":
        return "success"
      case "pending":
        return "warning"
      case "rejected":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusText = (status: Payment["status"]) => {
    switch (status) {
      case "approved":
        return "Aprobado"
      case "pending":
        return "Pendiente"
      case "rejected":
        return "Rechazado"
      default:
        return status
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
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Referencia</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{formatDate(payment.date)}</TableCell>
              <TableCell>{payment.description}</TableCell>
              <TableCell>{payment.reference}</TableCell>
              <TableCell>{formatCurrency(payment.amount)}</TableCell>
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
  )
}
