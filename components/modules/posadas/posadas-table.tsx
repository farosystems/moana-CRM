"use client"

import { Edit2, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Posada {
  id: string
  nombre: string
  ubicacion: string
  estrellas: number
  telefono: string
  email: string
  precio_referencia: number
  activo: boolean
}

interface PosadasTableProps {
  posadas: Posada[]
  onEdit?: (posada: Posada) => void
  onDelete?: (id: string) => void
}

export function PosadasTable({ posadas, onEdit, onDelete }: PosadasTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Nombre</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground hidden md:table-cell">Ubicación</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground hidden lg:table-cell">Categoría</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground hidden xl:table-cell">Precio Ref.</th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">Estado</th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {posadas.map((posada) => (
            <tr key={posada.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4 font-medium text-foreground">{posada.nombre}</td>
              <td className="py-3 px-4 text-muted-foreground hidden md:table-cell text-xs">
                {posada.ubicacion || "-"}
              </td>
              <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell text-xs">
                <div className="flex items-center gap-1">
                  {Array.from({ length: posada.estrellas }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  {posada.estrellas > 0 && (
                    <span className="ml-1 text-xs">({posada.estrellas})</span>
                  )}
                  {posada.estrellas === 0 && <span className="text-xs">Sin categoría</span>}
                </div>
              </td>
              <td className="py-3 px-4 text-muted-foreground hidden xl:table-cell text-xs">
                {posada.precio_referencia > 0 ? `$${posada.precio_referencia.toLocaleString()}` : "-"}
              </td>
              <td className="py-3 px-4 text-center">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    posada.activo
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {posada.activo ? "Activa" : "Inactiva"}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-1 justify-center flex-wrap">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit?.(posada)}
                    title="Editar"
                    className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete?.(posada.id)}
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
      {posadas.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay posadas para mostrar</p>
        </div>
      )}
    </div>
  )
}
