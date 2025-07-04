/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { actualizarUsuario } from "@/hooks/useClientes"; // aquí llamamos al hook que ya creamos
import Swal from "sweetalert2";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario?: {
    _id: string;
    nombre: string;
    cedula: string;
    correo: string;
    telefono: string;
    direccion: string;
    deuda: number;
    saldoAFavor?: number; // Asumimos que el saldo a favor es opcional
    getData?: () => Promise<void>;
  };
  getData?: () => Promise<void>;
}

export function UserModal({ isOpen, onClose, usuario, getData }: UserModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    cedula: "",
    direccion: "",
    deuda: "",
    saldoAFavor: 0, // Asumimos que 'saldoAFavor' es opcional
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        deuda: usuario.deuda.toString(), // Asumimos que 'saldo' es la deuda
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        cedula: usuario.cedula,
        direccion: usuario.direccion,
        saldoAFavor: usuario.saldoAFavor || 0, 
      });
    }
  }, [usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "saldoAFavor" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token || !usuario) throw new Error("No autorizado");

      await actualizarUsuario(usuario._id, formData, token);

       Swal.fire({
        title: "Usuario actualizado",
        text: "El usuario fue actualizado correctamente",
        icon: "success"
      });

      if (getData) {
        await getData(); // Llamamos a getData para refrescar la lista de usuarios
      }

      onClose();
    } catch (error: any) {
       Swal.fire({
        title: "Error al actualizar",
        text: error.message,
        icon: "error",
      });
      console.log(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>Modifica la información del usuario</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input name="correo" value={formData.correo} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cedula">Cédula</Label>
              <Input name="cedula" value={formData.cedula} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input name="telefono" value={formData.telefono} onChange={handleChange} required />
            </div>

             <div className="grid gap-2">
              <Label htmlFor="deuda">Deuda</Label>
              <Input name="deuda" value={formData.deuda} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="saldoAFavor">Saldo a Favor</Label>
              <Input
                name="saldoAFavor"
                type="number"
                value={formData.saldoAFavor}
                onChange={handleChange}
                required
              />
            </div>
            
          </div>

          <div className="grid gap-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Textarea name="direccion" value={formData.direccion} onChange={handleChange} required />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-green-600 hover:bg-green-700">
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
