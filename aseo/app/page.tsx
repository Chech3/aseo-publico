"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Upload,
  Truck,
  Users,
  Leaf,
  Recycle,
  MessageSquare,
  Lightbulb,
  Droplets,
  TreePine,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ComplaintModal } from "@/components/complaint-modal"

export default function Component() {
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false)
  const [complaintType, setComplaintType] = useState<"general" | "service" | "">("")

  const environmentalTips = [
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Separa tus residuos",
      description:
        "Clasifica los desechos en orgánicos, reciclables y no reciclables. Esto facilita el proceso de tratamiento y reduce el impacto ambiental.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <Droplets className="h-6 w-6" />,
      title: "Reduce el uso de plásticos",
      description:
        "Utiliza bolsas reutilizables, botellas de agua recargables y evita productos con exceso de empaque plástico.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <TreePine className="h-6 w-6" />,
      title: "Compostaje en casa",
      description:
        "Convierte tus residuos orgánicos en abono natural. Reduce la cantidad de basura y crea nutrientes para tus plantas.",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: <Recycle className="h-6 w-6" />,
      title: "Reutiliza antes de desechar",
      description:
        "Dale una segunda vida a los objetos. Muchos elementos pueden ser reparados, donados o transformados en algo útil.",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: <Trash2 className="h-6 w-6" />,
      title: "Evita el desperdicio de alimentos",
      description:
        "Planifica tus compras, almacena correctamente los alimentos y aprovecha las sobras para reducir residuos orgánicos.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Consume responsablemente",
      description:
        "Elige productos locales, de temporada y con menos empaque. Cada decisión de compra impacta el medio ambiente.",
      color: "from-yellow-500 to-yellow-600",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Aseo</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-50">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg">
                Registrarse
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-yellow-400/20"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="flex justify-center mb-6">
                  <div className="shadow-xl">
                    <Image
                      priority
                      className="rounded-lg w-auto h-auto"
                      src="/logo.jpeg"
                      alt="Logo"
                      width={200}
                      height={200}
                    />
                  </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-green-600 via-blue-600 to-green-700 bg-clip-text text-transparent">
                  Bienvenido
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                  Registra y administra los pagos del aseo urbano de tu municipio o empresa.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl transform hover:scale-105 transition-all"
                  >
                    Comenzar ahora
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50 shadow-lg bg-transparent"
                  >
                    Conocer más
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sección del camión animado */}
        <section className="py-8 bg-gradient-to-r from-blue-50 to-green-50 overflow-hidden relative">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Servicios en movimiento</h2>
              <p className="text-gray-600">Nuestros equipos trabajan constantemente para mantener la ciudad limpia</p>
            </div>
            {/* Animación del camión */}
            <div className="relative h-24 mb-8">
              {/* Carretera */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-400 rounded-full">
                <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-yellow-400 transform -translate-y-1/2"></div>
              </div>
              {/* Camión animado */}
              <div className="truck-container">
                <div className="truck p-3">
                  <Image width={800} height={800} src="/camion.png" alt="camion" className="h-28 w-32" />
                </div>
              </div>
            </div>
          </div>
          <style jsx>{`
            .truck-container {
              position: absolute;
              bottom: 8px;
              animation: moveTruck 15s linear infinite;
            }
            @keyframes moveTruck {
              0% {
                left: -80px;
                transform: scaleX(1);
              }
              48% {
                left: calc(100% - 60px);
                transform: scaleX(1);
              }
              50% {
                left: calc(100% - 60px);
                transform: scaleX(-1);
              }
              98% {
                left: -80px;
                transform: scaleX(-1);
              }
              100% {
                left: -80px;
                transform: scaleX(1);
              }
            }
            @media (max-width: 768px) {
              @keyframes moveTruck {
                0% {
                  left: -60px;
                  transform: scaleX(1);
                }
                48% {
                  left: calc(100% - 40px);
                  transform: scaleX(1);
                }
                50% {
                  left: calc(100% - 40px);
                  transform: scaleX(-1);
                }
                98% {
                  left: -60px;
                  transform: scaleX(-1);
                }
                100% {
                  left: -60px;
                  transform: scaleX(1);
                }
              }
            }
          `}</style>
        </section>

        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card className="flex flex-col text-center md:text-start border-0 shadow-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <CardHeader>
                  <div className="p-3 mx-auto md:mx-0 bg-gradient-to-r from-green-500 to-green-600 rounded-lg w-fit mb-4" >
                    <Upload className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-green-800">Registra servicios</CardTitle>
                  <CardDescription className="text-green-600">
                    Registra los servicios de aseo urbano realizados en tu municipio o empresa.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700">
                    Mantén un registro detallado de los servicios prestados, fechas y ubicaciones con nuestra página
                    web.
                  </p>
                </CardContent>
              </Card>

              <Card className=" flex flex-col text-center md:text-start border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <CardHeader>
                  <div className="p-3 mx-auto md:mx-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg w-fit mb-4">
                    <Truck className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-blue-800">Administra pagos</CardTitle>
                  <CardDescription className="text-blue-600">
                    Organiza y gestiona los pagos correspondientes a los servicios de limpieza.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700">
                    Visualiza el estado de los pagos y mantén un control financiero eficiente.
                  </p>
                </CardContent>
              </Card>

              <Card className="flex flex-col text-center md:text-start border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-100 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <CardHeader>
                  <div className="p-3 mx-auto md:mx-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg w-fit mb-4">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-orange-800">Fácil de usar</CardTitle>
                  <CardDescription className="text-orange-600">
                    Administra de forma eficiente los servicios de aseo urbano.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700">
                    Optimiza recursos y mejora la calidad de vida de toda la ciudad usando esta herramienta moderna.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Nueva sección de quejas */}
        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
                ¿Tienes alguna queja del servicio?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Tu opinión es importante para nosotros. Reporta cualquier problema con el servicio de aseo urbano y
                trabajaremos para solucionarlo.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => {
                  setComplaintType("service")
                  setIsComplaintModalOpen(true)
                }}
                size="lg"
                className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-xl transform hover:scale-105 transition-all"
              >
                <MessageSquare className="h-5 w-5" />
                Queja
              </Button>
              <Button
                onClick={() => {
                  setComplaintType("general")
                  setIsComplaintModalOpen(true)
                }}
                size="lg"
                variant="outline"
                className="gap-2 border-red-300 text-red-700 hover:bg-red-50 shadow-lg"
              >
                <MessageSquare className="h-5 w-5" />
                Sugerencia
              </Button>
            </div>
          </div>
        </section>

        {/* Nueva sección de consejos ambientales */}
        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-r from-green-100 via-blue-100 to-yellow-100">
          <div className="container px-4 md:px-6 text-center md:text-start">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Consejos para cuidar el medio ambiente
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pequeñas acciones pueden generar grandes cambios. Descubre cómo puedes contribuir a un planeta más
                limpio y sostenible desde tu hogar.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {environmentalTips.map((tip, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div className={`p-3 bg-gradient-to-r ${tip.color} rounded-lg w-fit mb-3 mx-auto md:mx-0`}>
                      <div className="text-white">{tip.icon}</div>
                    </div>
                    <CardTitle className="text-lg text-gray-800">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

           
          </div>
        </section>
      </main>

      <footer className="border-t bg-white/80 backdrop-blur-sm py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-600">© 2025 aseo. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/" className="text-sm text-green-600 hover:text-green-700 hover:underline">
              Contacto
            </Link>
            <Link href="/" className="text-sm text-green-600 hover:text-green-700 hover:underline">
              Términos y condiciones
            </Link>
          </div>
        </div>
        <ComplaintModal
          isOpen={isComplaintModalOpen}
          onClose={() => setIsComplaintModalOpen(false)}
          complaintType={complaintType}
        />
      </footer>
    </div>
  )
}
