"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin-header";
import { AdminShell } from "@/components/admin-shell";
import { ClientsList } from "@/components/admin/clients-list";
import { ComplaintsManagement } from "@/components/admin/ComplaintsManagement";
import { PaymentsManagement } from "@/components/admin/payments-management";
import { AdminOverview } from "@/components/admin/admin-overview";
import AdminRoute from "@/components/admin/AdminRoute";
import { useToast } from "@/hooks/use-toast";
import {
  getTodosLosClientesCantidad,
  getTodosLosDeudores,
  getPagosHoy,
} from "@/hooks/useTodosPagos";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Info = {
  cantidad: number;
};
export default function AdminPage() {
  const [data, setData] = useState(0);
  const [pagosHoy, setPagosHoy] = useState(0);
  const [deudores, setDeudores] = useState(0);
  const { toast } = useToast();
  const { logout } = useAuth();
  const token = localStorage.getItem("adminToken");

  const getData = async () => {
    if (!token) {
      toast({
        title: "Error",
        description: "No estás autenticado",
        variant: "destructive",
      });
      return;
    }

    getTodosLosClientesCantidad(token)
      .then((data: Info) => {
        setData(data?.cantidad);
      })
      .catch((error: Error) => {
        toast({
          title: "Error al cargar usuarios",
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

    getTodosLosDeudores(token)
      .then((data: Info) => {
        setDeudores(data?.cantidad);
      })
      .catch((error: Error) => {
        toast({
          title: "Error al cargar deudores",
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
    getPagosHoy(token)
      .then((data: Info) => {
        setPagosHoy(data?.cantidad);
      })
      .catch((error: Error) => {
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

  const factura = async () => {
    const confirm = window.confirm(
      "¿Deseas generar facturas para todos los usuarios?"
    );
    if (!confirm) return;
    try {
      const res = await fetch(
        "http://localhost:3001/api/pagos/admin/facturar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      alert(data.message);
      window.location.reload();
    } catch (err) {
      console.error("Error al facturar:", err);
      alert("Error al generar las facturas");
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <AdminRoute>
      <AdminShell>
        <AdminHeader
          heading="Panel Administrativo"
          text="Gestiona clientes, facturas y pagos del servicio de aseo."
        >
          <Button onClick={factura} className="bg-green-600 hover:bg-green-700">
            Generar deuda
          </Button>
        </AdminHeader>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="bills">Quejas</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pagos pendientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {deudores}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pagos realizados en este dia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {pagosHoy}
                  </div>
                  <p className="text-xs text-muted-foreground"></p>
                </CardContent>
              </Card>
            </div>
            <AdminOverview />
          </TabsContent>
          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de clientes</CardTitle>
                <CardDescription>
                  Administra la información de los clientes del servicio de
                  aseo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientsList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de quejas</CardTitle>
                <CardDescription>
                  Administra las quejas de los clientes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComplaintsManagement />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de pagos</CardTitle>
                <CardDescription>
                  Monitorea y administra todos los pagos recibidos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentsManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AdminShell>
    </AdminRoute>
  );
}
