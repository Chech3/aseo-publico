'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Upload, Truck, Users, Sparkles, Leaf, Recycle } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Aseo
            </span>
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
                Gestiona tus pagos fácilmente
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
                  className="border-green-300 text-green-700 hover:bg-green-50 shadow-lg"
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
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-yellow-400 transform -translate-y-1/2"></div>
            </div>

            {/* Camión animado */}
            <div className="truck-container">
              <div className="truck p-3 ">
                <Image width={200} height={200} src={"/camion.png"} alt="camion" className="h-24 w-24" />
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
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <CardHeader>
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg w-fit mb-4">
                  <Upload className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-green-800">Registra servicios</CardTitle>
                <CardDescription className="text-green-600">
                  Registra los servicios de aseo urbano realizados en tu municipio o empresa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-green-700">
                  Mantén un registro detallado de los servicios prestados, fechas y ubicaciones con nuestra interfaz
                  intuitiva.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <CardHeader>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg w-fit mb-4">
                  <Truck className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-blue-800">Administra pagos</CardTitle>
                <CardDescription className="text-blue-600">
                  Organiza y gestiona los pagos correspondientes a los servicios de limpieza.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700">
                  Visualiza el estado de los pagos, genera informes coloridos y mantén un control financiero eficiente.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-100 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <CardHeader>
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg w-fit mb-4">
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

      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-r from-green-100 via-blue-100 to-yellow-100">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Comprometidos con el medio ambiente
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestro sistema ayuda a optimizar los servicios del aseo urbano, contribuyendo a tener una ciudad más
              limpia y sostenible.
            </p>
          </div>
          <div className="flex justify-center gap-8 items-center">
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full w-fit mx-auto mb-2">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <p className="text-green-700 font-semibold">Eco-friendly</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full w-fit mx-auto mb-2">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <p className="text-blue-700 font-semibold">Limpio</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full w-fit mx-auto mb-2">
                <Recycle className="h-8 w-8 text-white" />
              </div>
              <p className="text-orange-700 font-semibold">Sostenible</p>
            </div>
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
      </footer>
    </div>
  )
}
