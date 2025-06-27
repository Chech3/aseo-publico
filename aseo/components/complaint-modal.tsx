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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Upload, ImageIcon, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaintType: "general" | "service" | "";
}

export function ComplaintModal({
  isOpen,
  onClose,
  complaintType,
}: ComplaintModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [uploadedFile, setUploadedFile] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const getModalTitle = () => {
    switch (complaintType) {
      case "general":
        return "Registrar sugerencia";
      case "service":
        return "Queja sobre el servicio";
      default:
        return "Registrar queja";
    }
  };

  const getModalDescription = () => {
    switch (complaintType) {
      case "general":
        return "Describe tu queja aporte que crees puede ayudarnos a mejorar.";
      case "service":
        return "Cuéntanos qué aspectos del servicio de aseo no cumplieron tus expectativas.";
      default:
        return "Describe tu queja para que podamos ayudarte.";
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamaño del archivo (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: "El archivo debe ser menor a 5MB.",
          variant: "destructive",
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
        toast({
          title: "Tipo de archivo no válido",
          description: "Solo se permiten archivos PNG, JPG, JPEG y WEBP.",
          variant: "destructive",
        });
        return;
      }

      setUploadedFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    // Validar campos requeridos
    const tipoQueja = formData.get("tipoQueja") as string;
    const descripcion = formData.get("descripcion") as string;

    if (!tipoQueja || !descripcion) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos marcados con *.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append("comprobante", uploadedFile); // archivo real
      formPayload.append("tipoQueja", tipoQueja || "");
      formPayload.append("descripcion", descripcion || "");
      formPayload.append("cedula", user?.cedula || "");
      formPayload.append("nombre", user?.nombre || "");
      formPayload.append("correo", user?.correo || "");
      formPayload.append("telefono", user?.telefono || "");
      formPayload.append(
        "fechaIncidente",
        (formData.get("fechaIncidente") as string) || ""
      );
      formPayload.append(
        "solucionEsperada",
        (formData.get("solucionEsperada") as string) || ""
      );
      await fetch("http://localhost:3001/api/quejas/registrar", {
        method: "POST",
        body: formPayload,
      });

      toast({
        title: "Queja registrada exitosamente",
        description:
          "Hemos recibido tu queja. Te contactaremos pronto para darle seguimiento.",
      });

      onClose();
    } catch {
      toast({
        title: "Error al registrar la queja",
        description:
          "Ha ocurrido un error al registrar tu queja. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {getModalTitle()}
          </DialogTitle>
          <DialogDescription>{getModalDescription()}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información personal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <FileText className="h-5 w-5" />
              <span className="text-lg">INFORMACIÓN DE CONTACTO</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  Nombre completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={user?.nombre || ""}
                  placeholder="Tu nombre completo"
                  required
                  disabled={!!user}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="correo">
                  Correo electrónico <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="correo"
                  name="correo"
                  value={user?.correo || ""}
                  type="email"
                  placeholder="tu@correo.com"
                  required
                  disabled={!!user}
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
                  value={user?.telefono || ""}
                  placeholder="Número de teléfono"
                  required
                  disabled={!!user}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cedula">Cedula</Label>
                <Input
                  id="cedula"
                  name="cedula"
                  value={user?.cedula || ""}
                  placeholder="28123123"
                  disabled={!!user}
                />
              </div>
            </div>
          </div>

          {/* Detalles de la queja */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-lg">DETALLES DE LA QUEJA O APORTE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoQueja">
                  Tipo de queja o aporte <span className="text-red-500">*</span>
                </Label>
                <Select name="tipoQueja" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calidad-servicio">
                      Calidad del servicio
                    </SelectItem>
                    <SelectItem value="personal">Personal de aseo</SelectItem>
                    <SelectItem value="horarios">
                      Horarios de servicio
                    </SelectItem>
                    <SelectItem value="facturacion">Facturación</SelectItem>
                    <SelectItem value="atencion-cliente">
                      Atención al cliente
                    </SelectItem>
                    <SelectItem value="equipos">
                      Equipos y materiales
                    </SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaIncidente">
                  Fecha del incidente (opcional)
                </Label>
                <Input id="fechaIncidente" name="fechaIncidente" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">
                Descripción detallada <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe detalladamente tu queja o aporte..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solucionEsperada">
                ¿Qué solución esperas? (opcional)
              </Label>
              <Textarea
                id="solucionEsperada"
                name="solucionEsperada"
                placeholder="Describe qué te gustaría que hiciéramos para resolver la problemática..."
                rows={3}
              />
            </div>
          </div>

          {/* Archivos adjuntos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <Upload className="h-5 w-5" />
              <span className="text-lg uppercase">
                Adjuntar Prueba (opcional)
              </span>
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
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
