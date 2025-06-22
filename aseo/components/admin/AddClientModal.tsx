// components/AddClientModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  token: string;
}

export function AddClientModal({
  open,
  onClose,
  onSuccess,
  token,
}: AddClientModalProps) {
  const initialForm = {
    nombre: "",
    cedula: "",
    direccion: "",
    telefono: "",
    correo: "",
    password: "",
    rol: "user",
  };
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState<string[]>([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const { toast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    setErrorList([]); // Limpiamos errores anteriores
    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setErrorList(data.errors); // Si viene el array de validaciones
        } else {
          setErrorList([data.message || "Error al registrar"]);
        }
        return;
      } else {
        toast({
          title: "Registro exitoso",
          description: "La cuenta ha sido creada correctamente.",
        });
        onSuccess?.();
        onClose();
        setForm(initialForm);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error al registrar",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar nuevo cliente</DialogTitle>
          {errorList.length > 0 && (
            <div className="bg-red-100 border border-red-300 text-red-800 px-5 py-4 rounded-md mx-6 mb-4">
              <ul className="list-disc pl-5 space-y-1">
                {errorList.map((err, idx) => (
                  <li key={idx} className="text-sm">
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Nombre</Label>
            <Input name="nombre" value={form.nombre} onChange={handleChange} />
          </div>
          <div>
            <Label>Cédula</Label>
            <Input name="cedula" value={form.cedula} onChange={handleChange} />
          </div>
          <div>
            <Label>Dirección</Label>
            <Input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Correo</Label>
            <Input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Rol</Label>
            <Select
              value={form.rol}
              onValueChange={(value) => setForm({ ...form, rol: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuario</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
