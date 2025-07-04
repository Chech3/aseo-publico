"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Upload, ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bill: any | null;
}

export function PaymentModal({ isOpen, onClose, bill }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();

  if (!bill) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamaño del archivo (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
         Swal.fire({
          title: "Archivo muy grande",
          text: "El archivo debe ser menor a 5MB.",
          icon: "error",
        });
        return;
      }

      // Validar tipo de archivo
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
         Swal.fire({
          title: "Tipo de archivo no válido",
          text: "Solo se permiten archivos PNG, JPG, JPEG y WEBP.",
          icon: "error",
        });
        return;
      }

      setUploadedFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(event.currentTarget);

    // Validar que todos los campos requeridos estén llenos
    const referencia = formData.get("referencia") as string;
    const monto = formData.get("monto") as string;
    const metodo = formData.get("metodo") as string;
    if (!referencia) {
       Swal.fire({
        title: "Campos requeridos",
        text: "Por favor complete el campo referencia *.",
        icon: "error",
      });
      setIsProcessing(false);
      return;
    }

    if (!uploadedFile) {
       Swal.fire({
        title: "Comprobante requerido",
        text: "Por favor sube el comprobante de pago.",
        icon: "error",
      });
      setIsProcessing(false);
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append("referencia", referencia);
      formPayload.append("comprobante", uploadedFile); // archivo real
      formPayload.append("monto", monto);
      formPayload.append("metodo", metodo || "");
      formPayload.append("cedula", user?.cedula || "");
      formPayload.append("nombre", user?.nombre || "");
      formPayload.append("correo", user?.correo || "");

      await fetch("http://localhost:3001/api/pagos/registrar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: formPayload,
      });

       Swal.fire({
        title: "Pago registrado exitosamente",
        text: `Tu pago ha sido registrado y está en proceso de verificación.`,
      });
      onClose();
      window.location.reload(); // Recargar la página para actualizar el estado
    } catch (error) {
      console.error("Error al registrar el pago:", error);
       Swal.fire({
        title: "Error al registrar el pago",
        text:
          "Ha ocurrido un error al registrar tu pago. Inténtalo de nuevo.",
        icon: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
          <DialogDescription>
            Completa tus datos y sube el comprobante de pago para procesar tu
            solicitud.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handlePayment} className="space-y-6">
          {/* Detalles de la factura */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Descripción:
              </span>
              <span className="font-medium">{bill.text}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Vencimiento:
              </span>
              <span className="font-medium">{formatDate(bill.dueDate)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-lg font-semibold">Total a pagar:</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(bill.amount)}
              </span>
            </div>
          </div>

          {/* Datos Personales */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <CreditCard className="h-5 w-5" />
              <span className="text-lg">DATOS PERSONALES</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  Nombres y Apellidos <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={user?.nombre || ""}
                  id="nombre"
                  name="nombre"
                  placeholder="Ingresa tu nombre completo"
                  required
                  className="h-12"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cedula">
                  Cédula <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cedula"
                  name="cedula"
                  value={user?.cedula || ""}
                  placeholder="Número de cédula"
                  required
                  className="h-12"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">
                  Teléfono <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="telefono"
                  name="telefono"
                  placeholder="Número de teléfono"
                  required
                  className="h-12"
                  disabled
                  value={user?.telefono || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monto">
                  Monto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="monto"
                  name="monto"
                  placeholder="25"
                  required
                  className="h-12"
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referencia">
                  Referencia del Pago (4 últimos dígitos)
                </Label>
                <Input
                  id="referencia"
                  name="referencia"
                  placeholder="Últimos 4 dígitos"
                  maxLength={4}
                  required
                  className="h-12"
                  type="number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metodo">Método de Pago</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  name="metodo"
                  id="metodo"
                >
                  <option value="Transferencia">Transferencia Bancaria</option>
                  <option value="Pago movil">Pago Movil</option>
                </select>
              </div>
            </div>
          </div>

          {/* Comprobante de Pago */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <Upload className="h-5 w-5" />
              <span className="text-lg">COMPROBANTE DE PAGO</span>
              <span className="text-red-500">*</span>
            </div>

            <div
              onClick={handleUploadClick}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-400 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />

              {uploadedFile ? (
                <div className="space-y-2">
                  <ImageIcon className="h-12 w-12 mx-auto text-green-600" />
                  <p className="text-green-600 font-medium">
                    Archivo seleccionado:
                  </p>
                  <p className="text-sm text-gray-600">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="text-green-600 font-medium">
                    Haz clic para subir una imagen
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, WEBP hasta 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Procesando..." : "Registrar pago"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
