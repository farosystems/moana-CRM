"use client"

import { MessageCircle, Mail, Edit2, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Cliente {
  id: string
  nombre: string
  email: string
  ciudad: string
  pais: string
  telefono: string
  whatsapp?: string
  leads: number
  fechaConversion?: string
}

interface ClientesTableProps {
  clientes: Cliente[]
  onDelete?: (id: string) => void
  onViewDetail?: (id: string) => void
}

export function ClientesTable({ clientes, onDelete, onViewDetail }: ClientesTableProps) {
  const handleWhatsApp = (cliente: Cliente) => {
    const message = encodeURIComponent(`Hola ${cliente.nombre}, te contactamos respecto a tus servicios turísticos.`)
    window.open(`https://wa.me/${cliente.whatsapp?.replace(/\D/g, "")}?text=${message}`)
  }

  const handleEmail = (cliente: Cliente) => {
    const subject = encodeURIComponent(`Consulta de servicios turísticos - ${cliente.nombre}`)
    const body = encodeURIComponent(
      `Hola ${cliente.nombre},\n\nEste es un seguimiento de nuestros servicios turísticos.`,
    )
    window.location.href = `mailto:${cliente.email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Nombre</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground hidden sm:table-cell">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground hidden md:table-cell">Ciudad</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground hidden lg:table-cell">País</th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">Leads</th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4 font-medium text-foreground">{cliente.nombre}</td>
              <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell text-xs">{cliente.email}</td>
              <td className="py-3 px-4 text-muted-foreground hidden md:table-cell text-xs">{cliente.ciudad}</td>
              <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell text-xs">{cliente.pais}</td>
              <td className="py-3 px-4 text-center font-semibold text-purple-600 dark:text-purple-400">
                {cliente.leads}
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-1 justify-center flex-wrap">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleWhatsApp(cliente)}
                    title="WhatsApp"
                    className="h-8 w-8 p-0 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEmail(cliente)}
                    title="Email"
                    className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewDetail?.(cliente.id)}
                    title="Ver Detalles"
                    className="h-8 w-8 p-0 text-cyan-600 hover:bg-cyan-100 dark:hover:bg-cyan-900/20"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    title="Editar"
                    className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete?.(cliente.id)}
                    title="Eliminar"
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {clientes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay clientes para mostrar</p>
        </div>
      )}
    </div>
  )
}
