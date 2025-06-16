import type React from "react"
// import { AdminNav } from "@/components/admin-nav"
import { UserNav } from "@/components/user-nav"
import {  Truck } from "lucide-react"

interface AdminShellProps {
  children: React.ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Truck className="h-6 w-6 text-green-600" />
            <span>Aseo</span>
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Admin</span>
          </div>
          <UserNav />
        </div>
      </header>
      <div className="container  flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        {/* <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]"> */}
          {/* <AdminNav /> */}
        {/* </aside> */}
        <main className="flex w-full flex-1 flex-col overflow-hidden py-6">{children}</main>
      </div>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2025 Aseo. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
