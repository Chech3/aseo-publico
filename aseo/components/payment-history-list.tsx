import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

interface PaymentHistory {
  id: string
  date: string
  billNumber: string
  description: string
  amount: number
  paymentMethod: string
  status: "completed" | "pending" | "failed"
  transactionId: string
}

const demoHistory: PaymentHistory[] = [
  {
    id: "1",
    date: "2025-05-15",
    billNumber: "ASE-2025-001",
    description: "Servicio de aseo - Mayo 2025",
    amount: 25,
    paymentMethod: "Transferencia bancaria",
    status: "completed",
    transactionId: "TXN-001234",
  },
  {
    id: "2",
    date: "2025-04-12",
    billNumber: "ASE-2025-002",
    description: "Servicio de aseo - Abril 2025",
    amount: 25,
    paymentMethod: "Transferencia bancaria",
    status: "completed",
    transactionId: "TXN-001235",
  },
  {
    id: "3",
    date: "2025-03-14",
    billNumber: "ASE-2025-003",
    description: "Servicio de aseo - Marzo 2025",
    amount: 25,
    paymentMethod: "Pago movil",
    status: "completed",
    transactionId: "TXN-001236",
  },
]

export function PaymentHistoryList() {
  const getStatusColor = (status: PaymentHistory["status"]) => {
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

  const getStatusText = (status: PaymentHistory["status"]) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demoHistory.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{formatDate(payment.date)}</TableCell>
              <TableCell>{payment.description}</TableCell>
              <TableCell>{payment.paymentMethod}</TableCell>
              <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(payment.status) as any}>{getStatusText(payment.status)}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" title="Ver comprobante">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" title="Descargar comprobante">
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
