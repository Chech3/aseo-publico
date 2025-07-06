/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard-shell";
import { PaymentHistoryList } from "@/components/payment-history-list";
import { CreditCard, History, Info, ArrowRight } from "lucide-react";
import { PaymentModal } from "@/components/payment-modal";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ComplaintModal } from "@/components/complaint-modal";
import PaymentInfo from "@/components/payment-info-card";
import { getDolar } from "@/hooks/valorDolar";
export default function DashboardPage() {
  const { user } = useAuth();

  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaintType, setComplaintType] = useState<any>("");
  const [estadoCuenta, setEstadoCuenta] = useState<EstadoCuenta | null>(null);
  const [mensaje, setMensaje] = useState<any>("");
  const [deuda, setDeuda] = useState<any>("");
  const [valorDolar, setValorDolar] = useState<number | string>();
  type EstadoCuenta = {
    deudaActual: number;
    saldoRestante: number;
  };

  // const [loading, setLoading] = useState(true);

  const handleComplaintClick = (type: "general" | "service") => {
    setComplaintType(type);
    setIsComplaintModalOpen(true);
  };

  const getData = async () => {
    const token = localStorage.getItem("adminToken");

    getDolar()
      .then((data: any) => {
        setValorDolar(data?.dolar_bcv + "bs");
      })
      .catch((error: Error) => {
        console.log(error.message);
        setValorDolar("error al cargar la informacion")
      });
    if (!token) {
      console.error("No hay token de autenticación");
      return;
    }

    fetch("http://localhost:3001/api/pagos/estado-cuenta", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setEstadoCuenta(data);
        // setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener estado de cuenta:", err);
        // setLoading(false);
      });

    fetch("http://localhost:3001/api/pagos/estado-deuda", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMensaje(data.mensaje);
        setDeuda(data.deudaCalculada);
        console.log(data.deudaCalculada);
        console.log(data.mensaje);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <ProtectedRoute>
      <DashboardShell>
        <div className="space-y-6">
          {/* Encabezado de bienvenida */}
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Bienvenido </h1>
            <p className="text-muted-foreground">
              Gestiona tus pagos de servicio de aseo de forma rápida y segura.
            </p>
          </div>
          <div>
            <p>
              Tasa del dia de hoy:
              <span className="font-bold ">
                {" "}
                {""} {valorDolar}
              </span>
            </p>
          </div>

          {/* Sección de saldo y pago rápido */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>
                  Tu saldo actual es:{" "}
                  <span className="text-green-600 font-bold">
                    {Math.abs(estadoCuenta?.saldoRestante ?? 0)}$
                  </span>
                </CardTitle>
                <CardDescription>Servicio de aseo - Junio 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Deuda pendiente:
                    </span>
                    <span className="text-2xl font-bold text-red-600">
                      {estadoCuenta?.deudaActual}$
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Fecha límite de pago:
                    </span>
                    <span className="font-medium">15 de Junio, 2025</span>
                  </div>
                  <div className="mt-4">
                    <ClientPayButton
                      disabled={estadoCuenta?.deudaActual === 0}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <PaymentInfo />
          </div>

          {/* Sección de estado de cuenta */}
          <Card className="shadow-md rounded-2xl border border-gray-200">
            <CardHeader className="bg-green-50 rounded-t-2xl px-6 py-4">
              <CardTitle className="text-lg font-bold text-green-800">
                Estado de tu cuenta
              </CardTitle>
              <CardDescription className="text-sm text-green-700">
                Resumen de tu servicio de aseo
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 py-5">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Cliente */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Cliente
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {user?.nombre}
                  </p>
                </div>

                {/* Dirección */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Dirección de servicio
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {user?.direccion}
                  </p>
                  <p className="text-sm text-gray-500">Falcón, Venezuela</p>
                </div>

                {/* Deuda */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Razón de Deuda
                  </p>
                  <p
                    className={`text-base font-semibold ${
                      deuda === 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {deuda === 0 ? "No posee deuda" : mensaje}
                  </p>
                  {/* <p className="text-sm text-gray-500">{meses}</p> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección de historial de pagos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Historial de pagos</CardTitle>
                <CardDescription>
                  Tus pagos de servicio de aseo anteriores
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <PaymentHistoryList />
            </CardContent>
          </Card>

          {/* Sección de ayuda */}
          <Card>
            <CardHeader>
              <CardTitle>¿Tienes algún problema con el servicio?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={() => handleComplaintClick("general")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Info className="h-4 w-4" />
                  <span>¿Alguna queja o sugerencia?</span>
                </Button>
                <Button
                  onClick={() => handleComplaintClick("service")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  <span> ¿No estás satisfecho con el servicio?</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
      <ComplaintModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        complaintType={complaintType}
      />
    </ProtectedRoute>
  );
}

// Componente para el botón de pago con estado local

type ClientPayButtonProps = {
  disabled?: boolean;
};

function ClientPayButton({}: // disabled

ClientPayButtonProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Datos de factura pendiente
  const pendingBill = {
    id: "1",
    billNumber: "ASE-2025-001",
    description: "Servicio de aseo - Junio 2025",
    amount: 25.0,
    dueDate: "2025-06-15",
    status: "pending",
    category: "Servicios",
  };

  return (
    <>
      <Button
        className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
        onClick={() => setIsPaymentModalOpen(true)}
      >
        <CreditCard className="h-4 w-4" />
        <span>Pagar ahora</span>
        <ArrowRight className="h-4 w-4 ml-auto" />
      </Button>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bill={pendingBill}
      />
    </>
  );
}
