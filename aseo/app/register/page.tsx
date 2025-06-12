"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [errorList, setErrorList] = useState<string[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorList([]); // Limpiamos errores anteriores

    const formData = new FormData(event.currentTarget);
    const correo = formData.get("correo") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const cedula = formData.get("cedula") as string;
    const telefono = formData.get("telefono") as string;
    const direccion = formData.get("direccion") as string;

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          cedula,
          direccion,
          telefono,
          password,
          correo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setErrorList(data.errors); // Si viene el array de validaciones
        } else {
          setErrorList([data.message || "Error al registrar"]);
        }
        return;
      }

      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente.",
      });

      login(data.user);
      router.push("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error en el registro:", error);
      setErrorList([error.message || "Intenta de nuevo"]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
  <Link
    href="/"
    className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 font-bold"
  >
    <Truck className="h-6 w-6 text-green-600" />
    <span className="text-green-600">Aseo</span>
  </Link>

  <Card className="w-full max-w-lg shadow-lg">
    <CardHeader className="space-y-2 text-center">
      <CardTitle className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
        Crear una cuenta
      </CardTitle>
      <CardDescription className="text-gray-500 dark:text-gray-400">
        Ingresa tus datos para registrarte en la plataforma
      </CardDescription>
    </CardHeader>

    {errorList.length > 0 && (
      <div className="bg-red-100 border border-red-300 text-red-800 px-5 py-4 rounded-md mx-6 mb-4">
        <ul className="list-disc pl-5 space-y-1">
          {errorList.map((err, idx) => (
            <li key={idx} className="text-sm">{err}</li>
          ))}
        </ul>
      </div>
    )}

    <form onSubmit={onSubmit}>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input id="name" name="name" placeholder="Juan Pérez" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cedula">Cédula</Label>
          <Input id="cedula" name="cedula" placeholder="28123123" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" name="telefono" placeholder="3001234567" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input id="direccion" name="direccion" placeholder="Calle 123" required />
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="correo">Correo electrónico</Label>
          <Input id="correo" name="correo" type="email" placeholder="ejemplo@correo.com" required />
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input placeholder="********" id="password" name="password" type="password" required />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full bg-green-600 hover:bg-green-700" type="submit" disabled={isLoading}>
          {isLoading ? "Registrando..." : "Registrarse"}
        </Button>
        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="underline text-green-600">
            Iniciar sesión
          </Link>
        </div>
      </CardFooter>
    </form>
  </Card>
</div>

  );
}
