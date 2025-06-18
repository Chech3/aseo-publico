"use client"

import { useState } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Send, Eye } from "lucide-react"
import { useQuejas } from "@/hooks/useQuejas" // <-- importa el hook

export function BillsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const { quejas, loading, error } = useQuejas()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const filteredQuejas = quejas.filter((q) =>
    q.tipoQueja.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar quejas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>Cargando quejas...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-red-500">{error}</TableCell>
              </TableRow>
            ) : filteredQuejas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No se encontraron quejas</TableCell>
              </TableRow>
            ) : (
              filteredQuejas.map((queja) => (
                <TableRow key={queja._id}>
                  <TableCell className="font-medium">{queja.tipoQueja}</TableCell>
                  <TableCell>{queja.nombre}</TableCell>
                  <TableCell>{queja.descripcion}</TableCell>
                  <TableCell>{formatDate(queja.fecha)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {queja.comprobante && (
                        <Button variant="outline" size="icon">
                          <a href={`http://localhost:3001${queja.comprobante}`} target="_blank" rel="noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
