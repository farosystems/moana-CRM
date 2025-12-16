"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, MapPin, TrendingUp, LogOut, Settings, Building2 } from "lucide-react"
import Image from "next/image"

interface SidebarProps {
  isOpen: boolean
  activeModule: string
  onModuleChange: (module: any) => void
}

export function Sidebar({ isOpen, activeModule, onModuleChange }: SidebarProps) {
  const modules = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      color: "text-blue-500",
    },
    {
      id: "sucursales",
      label: "Sucursales / Áreas",
      icon: Building2,
      color: "text-indigo-500",
    },
    {
      id: "vendedores",
      label: "Vendedores",
      icon: Users,
      color: "text-emerald-500",
    },
    {
      id: "clientes",
      label: "Clientes",
      icon: MapPin,
      color: "text-purple-500",
    },
    {
      id: "paquetes",
      label: "Paquetes",
      icon: MapPin,
      color: "text-blue-600",
    },
    {
      id: "leads",
      label: "Leads",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ]

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20",
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border px-3">
        {isOpen ? (
          <Image
            src="/logo moana.png"
            alt="Moana Logo"
            width={180}
            height={48}
            className="object-contain"
            priority
          />
        ) : (
          <Image
            src="/logo moana.png"
            alt="Moana Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                activeModule === module.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", module.color)} />
              {isOpen && <span className="text-sm font-medium">{module.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-4 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Settings className="w-4 h-4" />
          {isOpen && <span className="text-xs">Configuración</span>}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          {isOpen && <span className="text-xs">Salir</span>}
        </Button>
      </div>
    </aside>
  )
}
