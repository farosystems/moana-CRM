"use client"

import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Sucursal } from "@/types"

interface SucursalesTableProps {
  sucursales: Sucursal[]
  onEdit: (sucursal: Sucursal) => void
  onDelete: (id: string) => void
}

export function SucursalesTable({ sucursales, onEdit, onDelete }: SucursalesTableProps) {
  if (sucursales.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No hay sucursales registradas</p>
        <p className="text-muted-foreground text-sm mt-2">Comienza agregando tu primera sucursal</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Código</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Nombre</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Ciudad</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">País</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Teléfono</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Email</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sucursales.map((sucursal) => (
            <tr key={sucursal.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                  {sucursal.codigo}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="font-medium text-foreground">{sucursal.nombre}</div>
                {sucursal.direccion && (
                  <div className="text-sm text-muted-foreground mt-0.5">{sucursal.direccion}</div>
                )}
              </td>
              <td className="py-3 px-4 text-foreground">{sucursal.ciudad || "-"}</td>
              <td className="py-3 px-4 text-foreground">{sucursal.pais || "-"}</td>
              <td className="py-3 px-4 text-foreground">{sucursal.telefono || "-"}</td>
              <td className="py-3 px-4 text-foreground">{sucursal.email || "-"}</td>
              <td className="py-3 px-4">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(sucursal)}
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(sucursal.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
