/* eslint-disable @next/next/no-img-element */
import React, { useRef } from "react";

interface Queja {
  tipoQueja: string;
  nombre: string;
  telefono: string;
  descripcion: string;
  solucionEsperada?: string;
  fecha: string;
  comprobante?: string;
}

interface Props {
  queja: Queja | null;
  onClose: () => void;
}

export const QuejaModal: React.FC<Props> = ({ queja, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!queja) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={handleBackgroundClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-lg font-semibold mb-4">Detalles de la queja</h2>
        <p><strong>Tipo:</strong> {queja.tipoQueja}</p>
        <p><strong>Nombre:</strong> {queja.nombre}</p>
        <p><strong>Teléfono:</strong> {queja.telefono}</p>
        <p><strong>Descripción:</strong> {queja.descripcion}</p>
        <p><strong>Solución esperada:</strong> {queja.solucionEsperada || "No especificada"}</p>
        <p><strong>Fecha:</strong> {formatDate(queja.fecha)}</p>
        {queja.comprobante && (
          <img
            src={`http://localhost:3001${queja.comprobante}`}
            alt="Comprobante"
            className="w-full h-auto rounded mt-4"
          />
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
