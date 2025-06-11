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
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const { user } = useAuth();

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

          {/* Sección de saldo y pago rápido */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Tu saldo actual</CardTitle>
                <CardDescription>Servicio de aseo - Junio 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Saldo pendiente:
                    </span>
                    <span className="text-2xl font-bold text-red-600">
                      $25.00
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Fecha límite de pago:
                    </span>
                    <span className="font-medium">15 de Junio, 2025</span>
                  </div>
                  <div className="mt-4">
                    <ClientPayButton />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Datos para transferencia</CardTitle>
                <CardDescription>
                  Realiza tu pago por transferencia bancaria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 bg-green-50 p-4 rounded-md border border-green-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Banco:</span>
                    <span>Banco Nacional</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tipo de cuenta:</span>
                    <span>Corriente</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Número de cuenta:
                    </span>
                    <span className="font-mono">1234-5678-9012-3456</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Titular:</span>
                    <span>Servicio de Aseo C.A.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sección de estado de cuenta */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de tu cuenta</CardTitle>
              <CardDescription>Resumen de tu servicio de aseo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">Cliente</span>
                  <span className="font-medium">{user?.nombre}</span>
                  <span className="text-sm">ID: ASE-12345</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">
                    Dirección de servicio
                  </span>
                  <span className="font-medium">{user?.direccion}</span>
                  <span className="text-sm">Falcón, Venezuela</span>
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
              <CardTitle>¿Necesitas ayuda?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>Preguntas frecuentes</span>
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span> ¿No estas satisfecho con el servicio?</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </ProtectedRoute>
  );
}

// Componente para el botón de pago con estado local
function ClientPayButton() {
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
