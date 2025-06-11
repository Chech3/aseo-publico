"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Edit, Plus, Search } from "lucide-react"
import { CreateClientModal } from "@/components/admin/create-client-modal"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  serviceType: string
  monthlyFee: number
  status: "active" | "inactive" | "suspended"
  joinDate: string
}

const demoClients: Client[] = [
  {
    id: "1",
    name: "María González",
    email: "maria@email.com",
    phone: "+1234567890",
    address: "Calle 123 #45-67, Bogotá",
    serviceType: "Residencial",
    monthlyFee: 150000,
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos@email.com",
    phone: "+1234567891",
    address: "Carrera 45 #12-34, Medellín",
    serviceType: "Comercial",
    monthlyFee: 300000,
    status: "active",
    joinDate: "2024-02-20",
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana@email.com",
    phone: "+1234567892",
    address: "Avenida 67 #89-12, Cali",
    serviceType: "Residencial",
    monthlyFee: 120000,
    status: "suspended",
    joinDate: "2024-03-10",
  },
]

export function ClientsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "secondary"
      case "suspended":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusText = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return "Activo"
      case "inactive":
        return "Inactivo"
      case "suspended":
        return "Suspendido"
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
    }).format(date)
  }

  const filteredClients = demoClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo cliente
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Tipo de servicio</TableHead>
              <TableHead>Tarifa mensual</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-muted-foreground">Cliente desde {formatDate(client.joinDate)}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">{client.email}</div>
                    <div className="text-sm text-muted-foreground">{client.phone}</div>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{client.address}</TableCell>
                <TableCell>{client.serviceType}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(client.monthlyFee)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(client.status) as any}>{getStatusText(client.status)}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateClientModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
