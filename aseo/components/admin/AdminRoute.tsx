"use client";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.rol !== "admin") {
        router.push("/no-authorized"); // Redirige si no es admin
      }
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
