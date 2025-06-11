"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { CreditCard, Home, Settings, Upload, Users } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const items: NavItem[] = [
  {
    title: "Mi cuenta",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Saldos pendientes",
    href: "/dashboard/pending",
    icon: CreditCard,
  },
  {
    title: "Historial de pagos",
    href: "/dashboard/history",
    icon: Upload,
  },
  {
    title: "Mi perfil",
    href: "/dashboard/profile",
    icon: Users,
  },
  {
    title: "Configuración",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 py-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
