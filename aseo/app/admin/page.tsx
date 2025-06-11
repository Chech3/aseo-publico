import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin-header"
import { AdminShell } from "@/components/admin-shell"
import { ClientsList } from "@/components/admin/clients-list"
import { BillsManagement } from "@/components/admin/bills-management"
import { PaymentsManagement } from "@/components/admin/payments-management"
import { AdminOverview } from "@/components/admin/admin-overview"

export default function AdminPage() {
  return (
    <AdminShell>
      <AdminHeader heading="Panel Administrativo" text="Gestiona clientes, facturas y pagos del servicio de aseo.">
        <Button className="bg-green-600 hover:bg-green-700">Generar reporte</Button>
      </AdminHeader>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="bills">Facturas</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+12 este mes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Facturas pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">23</div>
                <p className="text-xs text-muted-foreground">-5 desde ayer</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagos hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">$4,250</div>
                <p className="text-xs text-muted-foreground">18 pagos procesados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos del mes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">$45,230</div>
                <p className="text-xs text-muted-foreground">+15% vs mes anterior</p>
              </CardContent>
            </Card>
          </div>
          <AdminOverview />
        </TabsContent>
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de clientes</CardTitle>
              <CardDescription>Administra la información de los clientes del servicio de aseo.</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientsList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de facturas</CardTitle>
              <CardDescription>Crea y administra las facturas de aseo de los clientes.</CardDescription>
            </CardHeader>
            <CardContent>
              <BillsManagement />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de pagos</CardTitle>
              <CardDescription>Monitorea y administra todos los pagos recibidos.</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentsManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminShell>
  )
}
