import type React from "react"
import { UserNav } from "@/components/user-nav"
import {Truck } from "lucide-react"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Truck className="h-6 w-6 text-green-600" />
            <span>Aseo</span>
          </div>
          <UserNav />
        </div>
      </header>
      <div className="container py-6 flex-1">
        <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
      </div>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2025 AseoManager. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Términos
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Privacidad
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
