"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Home } from "lucide-react"
import Link from "next/link"

interface AccessDeniedProps {
  title?: string
  description?: string
  showHomeButton?: boolean
  showRefreshButton?: boolean
  onRefresh?: () => void
}

export function AccessDenied({
  title = "Acceso denegado",
  description = "No tienes permisos para ver este contenido",
  showHomeButton = true,
}: AccessDeniedProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            {showHomeButton && (
              <Link href="/">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Home className="mr-2 h-4 w-4" />
                  Ir al inicio
                </Button>
              </Link>
            )}
          </div>

          <p className="text-xs text-muted-foreground">Si crees que esto es un error, contacta al administrador</p>
        </CardContent>
      </Card>
    </div>
  )
}
