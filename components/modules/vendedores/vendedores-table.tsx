"use client"

import { Button } from "@/components/ui/button"
import { Mail, MessageCircle, Edit, Trash2 } from "lucide-react"
import type { Vendedor } from "@/types"

interface VendedoresTableProps {
  vendedores: Vendedor[]
  onEdit?: (vendedor: Vendedor) => void
  onDelete?: (id: string) => void
}

export function VendedoresTable({ vendedores, onEdit, onDelete }: VendedoresTableProps) {
  const handleWhatsApp = (whatsapp: string) => {
    const message = "Hola, ¿cómo estás?"
    const url = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Vendedor</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground hidden sm:table-cell">Sucursal</th>
            <th className="text-center py-3 px-4 font-semibold text-foreground hidden md:table-cell">Contacto</th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vendedores.map((vendedor) => (
            <tr key={vendedor.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4">
                <div className="font-medium text-foreground">
                  {vendedor.nombre} {vendedor.apellido}
                </div>
                <div className="text-xs text-muted-foreground">{vendedor.email}</div>
              </td>
              <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell text-xs">{vendedor.sucursal || '-'}</td>
              <td className="py-3 px-4 hidden md:table-cell">
                <div className="flex gap-2 justify-center">
                  {vendedor.whatsapp && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleWhatsApp(vendedor.whatsapp!)}
                      className="text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEmail(vendedor.email)}
                    className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(vendedor)}
                    className="text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(vendedor.id)}
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {vendedores.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay vendedores para mostrar</p>
        </div>
      )}
    </div>
  )
}
