"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { DashboardHome } from "@/components/dashboard/dashboard-home"
import { SucursalesModule } from "@/components/modules/sucursales/sucursales-module"
import { VendedoresModule } from "@/components/modules/vendedores/vendedores-module"
import { ClientesModule } from "@/components/modules/clientes/clientes-module"
import { LeadsModule } from "@/components/modules/leads/leads-module"
import { PaquetesModule } from "@/components/modules/paquetes/paquetes-module"
import { PosadasModule } from "@/components/modules/posadas/posadas-module"
import { HabitacionesModule } from "@/components/modules/habitaciones/habitaciones-module"
import { ConfiguracionEmailModule } from "@/components/modules/configuracion/configuracion-email-module"

type ModuleType = "dashboard" | "sucursales" | "vendedores" | "clientes" | "leads" | "paquetes" | "posadas" | "habitaciones" | "configuracion"

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeModule, setActiveModule] = useState<ModuleType>("dashboard")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  const renderModule = () => {
    switch (activeModule) {
      case "sucursales":
        return <SucursalesModule />
      case "vendedores":
        return <VendedoresModule />
      case "clientes":
        return <ClientesModule />
      case "paquetes":
        return <PaquetesModule />
      case "leads":
        return <LeadsModule />
      case "posadas":
        return <PosadasModule />
      case "habitaciones":
        return <HabitacionesModule />
      case "configuracion":
        return <ConfiguracionEmailModule />
      default:
        return <DashboardHome />
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar isOpen={sidebarOpen} activeModule={activeModule} onModuleChange={setActiveModule} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto bg-background">
          <div className="w-full">{renderModule()}</div>
        </main>
      </div>

      <NotificationCenter />
    </div>
  )
}
