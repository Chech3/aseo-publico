"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PaymentData {
  transfer: {
    bank: string
    accountType: string
    accountNumber?: string
    holder: string
    cedula?: string
    phone?: string
  }
  mobile_payment: {
    bank: string
    phone?: string
    cedula?: string
    holder: string
  }
}

interface PaymentInfoCardProps {
  data?: PaymentData
}

export default function PaymentInfo({
  data = {
    transfer: {
      bank: "Banco Nacional",
      accountType: "Corriente",
      accountNumber: "1234-5678-9012-3456",
      holder: "Servicio de Aseo C.A.",
    },
    mobile_payment: {
      bank: "Banesco",
      phone: "0414-1234567",
      cedula: "V-12.345.678",
      holder: "Juan Perez",
    },
  },
}: PaymentInfoCardProps) {
  const [activeType, setActiveType] = useState<"transfer" | "mobile_payment">("transfer")

  const isTransfer = activeType === "transfer"
  const currentData = data[activeType]

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <div className="flex gap-2 mb-3">
          <Button
            variant={isTransfer ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveType("transfer")}
            className="flex-1"
          >
            Transferencia
          </Button>
          <Button
            variant={!isTransfer ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveType("mobile_payment")}
            className="flex-1"
          >
            Pago Móvil
          </Button>
        </div>
        <CardTitle>{isTransfer ? "Datos para transferencia" : "Datos para pago móvil"}</CardTitle>
        <CardDescription>
          {isTransfer ? "Realiza tu pago por transferencia bancaria" : "Realiza tu pago móvil a este número"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`space-y-2 p-4 rounded-md border ${
            isTransfer ? "bg-green-50 border-green-100" : "bg-blue-50 border-blue-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Banco:</span>
            <span>{currentData.bank}</span>
          </div>

          {isTransfer ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tipo de cuenta:</span>
                <span>
                  {"accountType" in currentData ? currentData.accountType : ""}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Número de cuenta:</span>
                <span className="font-mono">
                  {"accountNumber" in currentData && currentData.accountNumber ? currentData.accountNumber : ""}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Teléfono:</span>
                <span className="font-mono">{currentData.phone ? currentData.phone : ""}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cédula:</span>
                <span className="font-mono">{currentData.cedula ? currentData.cedula : ""}</span>
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Titular:</span>
            <span>{currentData.holder}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
