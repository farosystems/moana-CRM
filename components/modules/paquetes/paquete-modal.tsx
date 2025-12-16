"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface PaqueteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editingPaquete?: any | null
}

export function PaqueteModal({ isOpen, onClose, onSubmit, editingPaquete }: PaqueteModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    destino: "",
    fecha_inicio: "",
    fecha_fin: "",
    cupos: 1,
    precioAdulto: 0,
    precioMenor: 0,
    moneda: "USD",
    tarifa: "Media",
    servicios: "",
    politicas: "",
    imagen: "/paquete-turistico.jpg",
    notas: "",
  })

  useEffect(() => {
    if (editingPaquete) {
      setFormData(editingPaquete)
    }
  }, [editingPaquete])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mapear campos de camelCase a snake_case para la base de datos
    const dataToSubmit = {
      nombre: formData.nombre,
      destino: formData.destino,
      fecha_inicio: formData.fecha_inicio || null,
      fecha_fin: formData.fecha_fin || null,
      cupos: formData.cupos,
      cupos_disponibles: formData.cupos, // Inicialmente igual a cupos
      precio_adulto: formData.precioAdulto,
      precio_menor: formData.precioMenor,
      moneda: formData.moneda,
      tarifa: formData.tarifa,
      servicios: formData.servicios,
      politicas: formData.politicas,
      imagen: formData.imagen,
      notas: formData.notas,
    }

    onSubmit(dataToSubmit)
    setFormData({
      nombre: "",
      destino: "",
      fecha_inicio: "",
      fecha_fin: "",
      cupos: 1,
      precioAdulto: 0,
      precioMenor: 0,
      moneda: "USD",
      tarifa: "Media",
      servicios: "",
      politicas: "",
      imagen: "/paquete-turistico.jpg",
      notas: "",
    })
  }

  if (!isOpen) return null

  const monedas = ["USD", "EUR", "GBP", "ARS", "MXN", "COP"]
  const tarifas = ["Baja", "Media", "Alta"]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-lg w-full sm:w-[90%] md:w-[700px] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b border-border bg-card rounded-t-2xl sm:rounded-t-lg">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            {editingPaquete ? "Editar Paquete" : "Nuevo Paquete"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground hover:bg-muted">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Nombre y Destino */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nombre del Paquete</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Caribbean Paradise"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Destino</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bahamas"
                value={formData.destino}
                onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fecha de Inicio</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.fecha_inicio}
                onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fecha de Fin</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.fecha_fin}
                onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
              />
            </div>
          </div>

          {/* Cupos y Precios */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Stock/Cupos</label>
              <input
                type="number"
                required
                min="1"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.cupos}
                onChange={(e) => setFormData({ ...formData, cupos: Number.parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Precio Adulto</label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.precioAdulto}
                onChange={(e) => setFormData({ ...formData, precioAdulto: Number.parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Precio Menor</label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.precioMenor}
                onChange={(e) => setFormData({ ...formData, precioMenor: Number.parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Moneda</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.moneda}
                onChange={(e) => setFormData({ ...formData, moneda: e.target.value })}
              >
                {monedas.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tarifa */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tarifa por Temporada</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.tarifa}
              onChange={(e) => setFormData({ ...formData, tarifa: e.target.value })}
            >
              {tarifas.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Servicios Incluidos */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Servicios Incluidos</label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
              placeholder="Vuelo, Alojamiento, Tours, Comidas..."
              value={formData.servicios}
              onChange={(e) => setFormData({ ...formData, servicios: e.target.value })}
            />
          </div>

          {/* Políticas */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Políticas de Viaje / Cancelación</label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
              placeholder="Cancelación gratuita 30 días antes..."
              value={formData.politicas}
              onChange={(e) => setFormData({ ...formData, politicas: e.target.value })}
            />
          </div>

          {/* Notas Internas */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Notas Internas</label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-16"
              placeholder="Notas internas sobre este paquete..."
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-foreground border-border hover:bg-muted bg-transparent"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {editingPaquete ? "Guardar Cambios" : "Crear Paquete"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
