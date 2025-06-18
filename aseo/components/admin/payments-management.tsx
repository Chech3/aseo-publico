/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { getTodosLosPagos } from "@/hooks/useTodosPagos";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { actualizarPagoAdmin } from "@/hooks/useActualizarPago";

interface PaymentHistory {
  id: string;
  nombre?: string;
  monto: number;
  metodo: string;
  fecha: string;
  comprobante?: string;
  estado: "completado" | "pendiente" | "rechazado";
}

export function PaymentsManagement() {
  const [pagos, setPagos] = useState<PaymentHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(
    null
  );
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(
    null
  );

  const handleEdit = (payment: PaymentHistory) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const getStatusColor = (
    estado: PaymentHistory["estado"]
  ): "default" | "destructive" | "outline" | "secondary" => {
    switch (estado) {
      case "completado":
        return "secondary";
      case "pendiente":
        return "outline";
      case "rechazado":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusText = (estado: PaymentHistory["estado"]) => {
    switch (estado) {
      case "completado":
        return "Completado";
      case "pendiente":
        return "Pendiente";
      case "rechazado":
        return "Rechazado";
      default:
        return estado;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const filteredPayments = pagos.filter((payment) => {
    console.log(payment);
    const metodo = (payment.metodo ?? "").toLowerCase();
    const nombre = (payment.nombre ?? "").toLowerCase();
    const matchesSearch =
      metodo.includes(searchTerm.toLowerCase()) ||
      nombre.includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      metodo === statusFilter.toLowerCase() ||
      nombre === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPayments
    .filter((p) => (p.estado ?? "").toLowerCase() === "completado")
    .reduce((sum, payment) => sum + payment.monto, 0);

  const getData = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      toast({
        title: "Error",
        description: "No estás autenticado",
        variant: "destructive",
      });
      return;
    }

    getTodosLosPagos(token)
      .then((data) => {
        type PagoApi = {
          _id: string;
          monto: number;
          fecha: string;
          comprobante?: string;
          estado?: "completado" | "pendiente" | "rechazado";
          metodo?: string;
          nombre: string;
        };
        console.log("Pagos obtenidos:", data.pagos);

        const mappedPagos: PaymentHistory[] = data.pagos.map(
          (pago: PagoApi) => ({
            id: pago._id,
            monto: pago.monto,
            nombre: pago.nombre,
            fecha: pago.fecha,
            comprobante: pago.comprobante ?? "",
            estado: pago.estado ?? "pendiente",
            metodo: pago.metodo ?? "Pago móvil",
          })
        );
        setPagos(mappedPagos);
      })
      .catch((error) => {
        toast({
          title: "Error al cargar pagos",
          description: error.message,
          variant: "destructive",
        });
        if (error.message === "Token inválido") {
          logout();
          toast({
            title: "Sesión expirada",
            description: "Por favor, inicia sesión nuevamente.",
            variant: "destructive",
          });
        }
      });
  };

  useEffect(() => {
    getData();
  }, []);

  async function handleUpdate() {
    if (!selectedPayment) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast({
        title: "Error",
        description: "No estás autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      await actualizarPagoAdmin(token, selectedPayment.id, {
        monto: selectedPayment.monto,
        metodo: selectedPayment.metodo,
        estado: selectedPayment.estado,
      });

      toast({
        title: "Pago actualizado",
        description: "Se guardaron los cambios",
      });

      setShowModal(false);
      // Aquí podrías refrescar la tabla después
    } catch (error) {
      toast({
        title: "Error al actualizar",
        description:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message?: string }).message
            : "Error inesperado",
        variant: "destructive",
      });
    } finally {
      getData();
    }
  }

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
              <SelectItem value="completado">Completados</SelectItem>
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="rechazado">Rechazados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros avanzados
          </Button> */}
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
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Pagos completados</p>
            <p className="text-lg font-semibold">
              {filteredPayments.filter((p) => p.estado === "completado").length}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha y hora</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Comprobante</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.nombre}</TableCell>
                <TableCell>{formatDate(payment.fecha)}</TableCell>
                <TableCell>{payment.metodo}</TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(payment.monto)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(payment.estado)}>
                    {getStatusText(payment.estado)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {payment.comprobante && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`http://localhost:3001${payment.comprobante}`}
                      alt="Comprobante"
                      className="w-32 rounded shadow cursor-pointer hover:scale-105 transition"
                      onClick={() =>
                        setImagenSeleccionada(
                          `http://localhost:3001${payment.comprobante}`
                        )
                      }
                    />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(payment)}
                    >
                      <Pencil />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {showModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md w-[400px] space-y-4">
              <h2 className="text-lg font-semibold mb-4">Editar Pago</h2>

              <div className="space-y-3">
                <div>
                  <label>Monto:</label>
                  <Input
                    type="number"
                    value={selectedPayment.monto}
                    onChange={(e) =>
                      setSelectedPayment({
                        ...selectedPayment,
                        monto: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label>Método:</label>
                  <Input
                    value={selectedPayment.metodo}
                    onChange={(e) =>
                      setSelectedPayment({
                        ...selectedPayment,
                        metodo: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label>Estado:</label>
                  <Select
                    value={selectedPayment.estado}
                    onValueChange={(value) =>
                      setSelectedPayment({
                        ...selectedPayment,
                        estado: value as any,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="completado">Completado</SelectItem>
                      <SelectItem value="rechazado">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdate}>Guardar</Button>
              </div>
            </div>
          </div>
        )}
        {imagenSeleccionada && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="relative">
              <img
                src={imagenSeleccionada}
                alt="Vista previa"
                className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg"
              />
              <button
                onClick={() => setImagenSeleccionada(null)}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
