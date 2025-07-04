"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Plus, Search } from "lucide-react";
import { UserModal } from "@/components/admin/create-client-modal";
import { useAuth } from "@/context/AuthContext";
import { getTodosLosClientes } from "@/hooks/useClientes";
import { AddClientModal } from "@/components/admin/AddClientModal";
import Swal from "sweetalert2";

interface Client {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  cedula: string;
  deuda?: string; // Asumimos que la deuda es opcional
  saldoAFavor?: string; // Asumimos que el saldo a favor es opcional
}

export function ClientsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("adminToken");
  const { logout } = useAuth();
  const [clientes, setClientes] = useState<Client[]>([]);
  const [selectedUsuario, setSelectedUsuario] = useState<Client | null>(null);

  const filteredClients = clientes.filter(
    (client) =>
      client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getData = async () => {

    if (!token) {
       Swal.fire({
        title: "Error",
        text: "No estás autenticado",
        icon: "error",
      });
      return;
    }

    getTodosLosClientes(token)
      .then((data) => {
        type ClienteApi = {
          _id: string;
          nombre: string;
          monto: number;
          fecha: string;
          comprobante?: string;
          telefono: string;
          direccion: string;
          cedula: string;
          correo: string;
          deuda?: string; // Asumimos que la deuda es opcional
          saldoAFavor?: string; // Asumimos que el saldo a favor es opcional
        };

        const mappedClientes: Client[] = data.usuarios.map(
          (cliente: ClienteApi) => ({
            id: cliente._id,
            nombre: cliente.nombre,
            correo: cliente.correo,
            telefono: cliente.telefono,
            direccion: cliente.direccion,
            cedula: cliente.cedula,
            deuda: cliente.deuda,
            saldoAFavor: cliente.saldoAFavor,
          })
        );
        setClientes(mappedClientes);
      })
      .catch((error) => {
         Swal.fire({
          title: "Error al cargar clientes",
          text: error.message,
          icon: "error",
        });
        if (error.message === "Token inválido") {
          logout();
           Swal.fire({
            title: "Sesión expirada",
            text: "Por favor, inicia sesión nuevamente.",
            icon: "error",
          });
        }
      });
  };

  useEffect(() => {
    getData();
  }, []);

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
        <Button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700"
        >
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
              <TableHead>Teléfono</TableHead>
              <TableHead>Deuda</TableHead>
              <TableHead>Saldo a Favor</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients?.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{client.nombre}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">{client.correo}</div>
                    <div className="text-sm text-muted-foreground">
                      {client.telefono}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {client.direccion}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {client.telefono}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {client.deuda}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {client.saldoAFavor}
                </TableCell>
                {/* <TableCell>{client.serviceType}</TableCell> */}
                {/* <TableCell className="font-semibold">
                  {formatCurrency(client.monthlyFee)}
                </TableCell> */}

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedUsuario(client)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddClientModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={getData}
        token={token ?? ""}
      />

      <UserModal
        isOpen={!!selectedUsuario}
        getData={getData}
        onClose={() => setSelectedUsuario(null)}
        usuario={
          selectedUsuario
            ? {
                _id: selectedUsuario.id,
                nombre: selectedUsuario.nombre,
                cedula: selectedUsuario.cedula,
                correo: selectedUsuario.correo,
                telefono: selectedUsuario.telefono,
                direccion: selectedUsuario.direccion,
                deuda: selectedUsuario.deuda,
                saldoAFavor: selectedUsuario.saldoAFavor,
              }
            : undefined
        }
      />
    </div>
  );
}
