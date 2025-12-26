"use client"

import { MessageCircle, Mail, Edit2, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEmail } from "@/hooks/use-email"
import { useState } from "react"
import { toast } from "sonner"

interface Cliente {
  id: string
  nombre: string
  email: string
  ciudad: string
  pais: string
  telefono: string
  whatsapp?: string
  vendedorAsignado?: string
  fechaConversion?: string
}

interface ClientesTableProps {
  clientes: Cliente[]
  onEdit?: (cliente: Cliente) => void
  onDelete?: (id: string) => void
  onViewDetail?: (id: string) => void
}

export function ClientesTable({ clientes, onEdit, onDelete, onViewDetail }: ClientesTableProps) {
  const { sendEmail } = useEmail()
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null)

  const handleWhatsApp = (cliente: Cliente) => {
    const message = encodeURIComponent(`Hola ${cliente.nombre}, te contactamos respecto a tus servicios turísticos.`)
    window.open(`https://wa.me/${cliente.whatsapp?.replace(/\D/g, "")}?text=${message}`)
  }

  const handleEmail = async (cliente: Cliente) => {
    if (!cliente.email) return

    setSendingEmailId(cliente.id)

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #9333ea;">Hola ${cliente.nombre},</h2>
        <p>Esperamos que te encuentres muy bien.</p>
        <p>Te contactamos para darte seguimiento sobre nuestros servicios turísticos y asegurarnos de que tengas la mejor experiencia con nosotros.</p>
        <p>Si tienes alguna pregunta o necesitas información adicional, no dudes en contactarnos.</p>
        <br>
        <p>Saludos cordiales,</p>
        <p><strong>Equipo Moana CRM</strong></p>
      </div>
    `

    const result = await sendEmail({
      to: cliente.email,
      subject: `Seguimiento de servicios turísticos - ${cliente.nombre}`,
      html: emailHtml,
      text: `Hola ${cliente.nombre},\n\nEsperamos que te encuentres muy bien.\n\nTe contactamos para darte seguimiento sobre nuestros servicios turísticos y asegurarnos de que tengas la mejor experiencia con nosotros.\n\nSaludos,\nEquipo Moana CRM`,
    })

    setSendingEmailId(null)

    if (result.success) {
      toast.success("Email enviado exitosamente")
    } else {
      toast.error(`Error al enviar email: ${result.error}`)
    }
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
            <th className="text-left py-3 px-4 font-semibold text-foreground hidden xl:table-cell">Vendedor</th>
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
              <td className="py-3 px-4 text-muted-foreground hidden xl:table-cell text-xs">{cliente.vendedorAsignado || '-'}</td>
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
                    disabled={sendingEmailId === cliente.id}
                    className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 disabled:opacity-50"
                  >
                    {sendingEmailId === cliente.id ? (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
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
                    onClick={() => onEdit?.(cliente)}
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
