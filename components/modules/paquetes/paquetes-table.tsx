"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Paquete } from "@/types"

interface PaquetesTableProps {
  paquetes: Paquete[]
  onEdit: (paquete: Paquete) => void
  onDelete: (id: string) => void
}

export function PaquetesTable({ paquetes, onEdit, onDelete }: PaquetesTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPaquetes = paquetes.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.destino.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (paquetes.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No hay paquetes registrados</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Search */}
      <div className="p-4 md:p-6 border-b border-border">
        <input
          type="text"
          placeholder="Buscar por nombre o destino..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3 p-4">
        {filteredPaquetes.map((paquete) => (
          <div key={paquete.id} className="border border-border rounded-lg overflow-hidden">
            {/* Card Header */}
            <div
              className="p-4 bg-muted/50 cursor-pointer flex items-center justify-between hover:bg-muted transition"
              onClick={() => setExpandedId(expandedId === paquete.id ? null : paquete.id)}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{paquete.nombre}</h3>
                <p className="text-sm text-muted-foreground">{paquete.destino}</p>
              </div>
              {expandedId === paquete.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>

            {/* Expandable Content */}
            {expandedId === paquete.id && (
              <div className="p-4 space-y-3 border-t border-border">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Cupos</p>
                    <p className="font-semibold text-foreground">{paquete.cupos}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tarifa</p>
                    <p className="font-semibold text-foreground">{paquete.tarifa}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Adulto</p>
                    <p className="font-semibold text-blue-600">
                      {paquete.precio_adulto || paquete.precioAdulto} {paquete.moneda}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Menor</p>
                    <p className="font-semibold text-blue-600">
                      {paquete.precio_menor || paquete.precioMenor} {paquete.moneda}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Fechas</p>
                  <p className="text-sm text-foreground">
                    {paquete.fecha_inicio && paquete.fecha_fin
                      ? `${paquete.fecha_inicio} - ${paquete.fecha_fin}`
                      : paquete.fechasDisponibles || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Servicios</p>
                  <p className="text-sm text-foreground">{paquete.servicios}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={() => onEdit(paquete)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => onDelete(paquete.id)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Destino</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Cupos</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Adulto / Menor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tarifa</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fechas</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredPaquetes.map((paquete) => (
              <tr key={paquete.id} className="hover:bg-muted/30 transition">
                <td className="px-6 py-4">
                  <p className="font-semibold text-foreground">{paquete.nombre}</p>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{paquete.destino}</td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      paquete.cupos > 5
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                    )}
                  >
                    {paquete.cupos} cupos
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="text-blue-600 font-medium">
                      {paquete.precio_adulto || paquete.precioAdulto} {paquete.moneda}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {paquete.precio_menor || paquete.precioMenor} {paquete.moneda}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      paquete.tarifa === "Alta"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : paquete.tarifa === "Media"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                    )}
                  >
                    {paquete.tarifa}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground max-w-[150px] truncate">
                  {paquete.fecha_inicio && paquete.fecha_fin
                    ? `${paquete.fecha_inicio} - ${paquete.fecha_fin}`
                    : paquete.fechasDisponibles || '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                      onClick={() => onEdit(paquete)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={() => onDelete(paquete.id)}
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
    </div>
  )
}
