"use client"

import { Edit2, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Habitacion {
  id: string
  nombre: string
  tipo_habitacion: string
  capacidad: number
  precio_por_noche: number
  activo: boolean
}

interface HabitacionesTableProps {
  habitaciones: Habitacion[]
  onEdit?: (habitacion: Habitacion) => void
  onDelete?: (id: string) => void
}

export function HabitacionesTable({ habitaciones, onEdit, onDelete }: HabitacionesTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Habitación</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground hidden md:table-cell">Tipo</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground hidden lg:table-cell">Capacidad</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground hidden xl:table-cell">Precio/Noche</th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">Estado</th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {habitaciones.map((habitacion) => (
            <tr key={habitacion.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4 font-medium text-foreground">{habitacion.nombre}</td>
              <td className="py-3 px-4 text-muted-foreground hidden md:table-cell text-xs">
                {habitacion.tipo_habitacion || "-"}
              </td>
              <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell text-xs">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {habitacion.capacidad} {habitacion.capacidad === 1 ? "persona" : "personas"}
                </div>
              </td>
              <td className="py-3 px-4 text-muted-foreground hidden xl:table-cell text-xs font-medium">
                {habitacion.precio_por_noche > 0 ? `$${habitacion.precio_por_noche.toLocaleString()}` : "-"}
              </td>
              <td className="py-3 px-4 text-center">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    habitacion.activo
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {habitacion.activo ? "Activa" : "Inactiva"}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-1 justify-center flex-wrap">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit?.(habitacion)}
                    title="Editar"
                    className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete?.(habitacion.id)}
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
      {habitaciones.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay habitaciones para mostrar</p>
        </div>
      )}
    </div>
  )
}
