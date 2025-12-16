"use client"

import { Mail, Edit2, Trash2, History, MessageCircle, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Lead {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono?: string
  pais?: string
  ciudad?: string
  tipoConsulta: string
  origen: string
  vendedorAsignado?: string
  estado: string
  notasInternas?: string
  paqueteSugerido?: string
  fechaIngreso: string
}

interface LeadsTableProps {
  leads: Lead[]
  getEstadoColor: (estado: string) => string
  onDelete?: (id: string) => void
  onUpdate?: (id: string, updates: any) => void
  onViewHistory?: (id: string) => void
  onConvertToClient?: (id: string) => void
}

export function LeadsTable({ leads, getEstadoColor, onDelete, onUpdate, onViewHistory, onConvertToClient }: LeadsTableProps) {
  const handleSendEmail = (lead: Lead) => {
    if (lead.email) {
      const subject = encodeURIComponent(`Consulta: ${lead.tipoConsulta}`)
      const body = encodeURIComponent(
        `Hola ${lead.nombre} ${lead.apellido},\n\nEsperamos poder ayudarte con tu consulta de ${lead.tipoConsulta}.\n\nNo dudes en contáctanos.\n\nSaludos`,
      )
      window.location.href = `mailto:${lead.email}?subject=${subject}&body=${body}`
    }
  }

  const handleWhatsApp = (lead: Lead) => {
    if (lead.telefono) {
      const phoneNumber = lead.telefono.replace(/\D/g, "")
      const message = encodeURIComponent(
        `Hola ${lead.nombre}, te contactamos respecto a tu consulta de ${lead.tipoConsulta}. ¿Cómo podemos ayudarte?`,
      )
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Nombre</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground hidden sm:table-cell">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground hidden md:table-cell">Tipo</th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">Estado</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground hidden lg:table-cell">Vendedor</th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4 font-medium text-foreground max-w-xs truncate">
                {lead.nombre} {lead.apellido}
              </td>
              <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell text-xs truncate">{lead.email}</td>
              <td className="py-3 px-4 text-muted-foreground hidden md:table-cell text-xs">{lead.tipoConsulta}</td>
              <td className="py-3 px-4 text-center">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getEstadoColor(lead.estado)}`}>
                  {lead.estado}
                </span>
              </td>
              <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell text-xs">{lead.vendedorAsignado || '-'}</td>
              <td className="py-3 px-4">
                <div className="flex gap-1 justify-center flex-wrap">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onConvertToClient?.(lead.id)}
                    title="Convertir a Cliente"
                    className="h-8 w-8 p-0 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleWhatsApp(lead)}
                    title="Enviar WhatsApp"
                    className="h-8 w-8 p-0 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSendEmail(lead)}
                    title="Enviar email"
                    className="h-8 w-8 p-0 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/20"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewHistory?.(lead.id)}
                    title="Ver historial"
                    className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                  >
                    <History className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onUpdate?.(lead.id, { estado: "En gestión" })}
                    title="Editar"
                    className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete?.(lead.id)}
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
      {leads.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay leads para mostrar</p>
        </div>
      )}
    </div>
  )
}
