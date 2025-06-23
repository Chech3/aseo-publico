/* eslint-disable @next/next/no-img-element */
"use client";
import { useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, StickyNote } from "lucide-react";
import { useQuejas, Queja } from "@/hooks/useQuejas";
import { QuejaModal } from "../QuejaModal";
import { getBase64FromUrl } from "@/lib/imageTo64";
import jsPDF from "jspdf";

export function ComplaintsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const { quejas, loading, error } = useQuejas();
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(
    null
  );
  const [quejaSeleccionada, setQuejaSeleccionada] = useState<Queja | null>(
    null
  );

  const modalRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const filteredQuejas = quejas.filter(
    (q) =>
      q.tipoQueja.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setImagenSeleccionada(null);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleExportPDF = async (queja: any) => {
    if (!queja) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de Queja", 14, 20);

    doc.setFontSize(12);
    let y = 30;

    const addLine = (label: string, value: string) => {
      const splitText = doc.splitTextToSize(`${label}: ${value}`, 180);
      doc.text(splitText, 14, y);
      y += splitText.length * 8;
    };

    addLine("Tipo", queja.tipoQueja);
    addLine("Nombre", queja.nombre);
    addLine("Teléfono", queja.telefono);
    addLine("Descripción", queja.descripcion);
    addLine("Solución esperada", queja.solucionEsperada || "No especificada");
    addLine("Fecha", formatDate(queja.fecha));

    // Agregar comprobante si existe
    if (queja.comprobante) {
      try {
        const base64Img = await getBase64FromUrl(
          `http://localhost:3001${queja.comprobante}`
        );
        const imgProps = doc.getImageProperties(base64Img);

        // Ajusta el tamaño de la imagen proporcionalmente (máx 160px ancho)
        const imgWidth = 80;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        if (y + imgHeight > 280) {
          doc.addPage();
          y = 20;
        }

        doc.text("Prueba:", 14, y + 10);
        doc.addImage(base64Img, "JPEG", 14, y + 15, imgWidth, imgHeight);
      } catch (err) {
        console.error("No se pudo cargar la imagen:", err);
        doc.text("Comprobante: (Error al cargar imagen)", 14, y + 10);
      }
    }

    doc.save(`queja_${queja.nombre.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar quejas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              {/* <TableHead>Descripción</TableHead> */}
              {/* <TableHead>Solución Esperada</TableHead> */}
              <TableHead>Fecha</TableHead>
              <TableHead>Prueba</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8}>Cargando quejas...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredQuejas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>No se encontraron quejas</TableCell>
              </TableRow>
            ) : (
              filteredQuejas.map((queja) => (
                <TableRow key={queja._id}>
                  <TableCell className="font-medium">
                    {queja.tipoQueja}
                  </TableCell>
                  <TableCell>{queja.nombre}</TableCell>
                  <TableCell>{queja.telefono}</TableCell>
                  {/* <TableCell>{queja.descripcion}</TableCell> */}
                  {/* <TableCell>{queja.solucionEsperada || "N/E"}</TableCell> */}
                  <TableCell>{formatDate(queja.fecha)}</TableCell>
                  <TableCell>
                    {queja.comprobante && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`http://localhost:3001${queja.comprobante}`}
                        alt="Comprobante"
                        className="w-16 h-16 rounded shadow cursor-pointer hover:scale-105 transition"
                        onClick={() =>
                          setImagenSeleccionada(
                            `http://localhost:3001${queja.comprobante}`
                          )
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-end space-x-2">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuejaSeleccionada(queja)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        handleExportPDF(queja);
                      }}
                    >
                      <StickyNote />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {imagenSeleccionada && (
          <div
            onClick={handleBackgroundClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          >
            <div ref={modalRef} className="relative">
              <img
                src={imagenSeleccionada}
                alt="Vista previa"
                className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg"
              />
              <button
                onClick={() => setImagenSeleccionada(null)}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        <QuejaModal
          queja={quejaSeleccionada}
          onClose={() => setQuejaSeleccionada(null)}
        />
      </div>
    </div>
  );
}
