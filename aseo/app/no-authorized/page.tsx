"use client";

import { useState } from "react";
import { AccessDenied } from "@/components/access-denied";


export default function UnauthorizedExamplePage() {
  const [hasPermission, setHasPermission] = useState(false);

  // Ejemplo de uso del componente AccessDenied dentro de una página
  if (!hasPermission) {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <AccessDenied
              title="Acceso restringido"
              description="Esta sección requiere permisos de administrador avanzado"
              showRefreshButton={true}
              onRefresh={() => setHasPermission(true)}
            />
        </div>
    );
  }
}
