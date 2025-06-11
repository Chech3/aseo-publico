// components/ProtectedRoute.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirige si no está autenticado
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Image
          src="/bars-rotate-fade.svg"
          alt="Cargando..."
          width={80}
          height={80}
          className="mb-4"
        />
        <p className="text-gray-500 text-sm">Cargando tu información...</p>
      </div>
    );
  }

  return <>{children}</>;
}
