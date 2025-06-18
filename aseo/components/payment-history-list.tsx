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
import { getUltimosPagos } from "@/hooks/useUltimosPagos";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface PaymentHistory {
  id: string;
  monto: number;
  fecha: string;
  comprobante?: string;
  estado: "completado" | "pendiente" | "rechazado";
  metodo: string;
}

export function PaymentHistoryList() {
  const [pagos, setPagos] = useState<PaymentHistory[]>([]);
  const { toast } = useToast();
  const { logout } = useAuth();
  const getStatusColor = (estado: PaymentHistory["estado"]): "default" | "destructive" | "outline" | "secondary" => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      toast({
        title: "Error",
        description: "No estás autenticado",
        variant: "destructive",
      });
      return;
    }

    getUltimosPagos(token)
      .then((data) => {
        type PagoApi = {
          _id: string;
          monto: number;
          fecha: string;
          comprobante?: string;
          estado?: "completado" | "pendiente" | "rechazado";
          metodo?: string;
        };

        const mappedPagos: PaymentHistory[] = data.pagos.map(
          (pago: PagoApi) => ({
            id: pago._id,
            monto: pago.monto,
            fecha: pago.fecha,
            comprobante: pago.comprobante ?? "",
            estado: pago.estado ?? "pendiente", // asigno un estado por defecto si no viene
            metodo: pago.metodo ?? "Pago móvil", // asigno método por defecto si no viene
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
  }, [logout, toast]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagos.map((payment) => (
            <TableRow key={payment.id}>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
