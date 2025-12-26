"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface HabitacionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  habitacion?: any
}

export function HabitacionModal({ isOpen, onClose, onSubmit, habitacion }: HabitacionModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    tipo_habitacion: "",
    capacidad: 1,
    precio_por_noche: 0,
    descripcion: "",
    activo: true,
  })

  useEffect(() => {
    if (habitacion && isOpen) {
      setFormData({
        nombre: habitacion.nombre || "",
        tipo_habitacion: habitacion.tipo_habitacion || "",
        capacidad: habitacion.capacidad || 1,
        precio_por_noche: habitacion.precio_por_noche || 0,
        descripcion: habitacion.descripcion || "",
        activo: habitacion.activo ?? true,
      })
    } else if (!isOpen) {
      resetForm()
    }
  }, [habitacion, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      tipo_habitacion: "",
      capacidad: 1,
      precio_por_noche: 0,
      descripcion: "",
      activo: true,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-lg w-full sm:w-[600px] max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card rounded-t-2xl sm:rounded-t-lg">
          <h2 className="text-xl font-bold text-foreground">
            {habitacion ? "Editar Habitación" : "Nueva Habitación"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground hover:bg-muted">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Nombre de la Habitación *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Habitación 101"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tipo de Habitación</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.tipo_habitacion}
                onChange={(e) => setFormData({ ...formData, tipo_habitacion: e.target.value })}
              >
                <option value="">Seleccionar tipo</option>
                <option value="Simple">Simple</option>
                <option value="Doble">Doble</option>
                <option value="Triple">Triple</option>
                <option value="Suite">Suite</option>
                <option value="Suite Junior">Suite Junior</option>
                <option value="Suite Presidencial">Suite Presidencial</option>
                <option value="Familiar">Familiar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Capacidad (personas) *</label>
              <input
                type="number"
                required
                min="1"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="2"
                value={formData.capacidad}
                onChange={(e) => setFormData({ ...formData, capacidad: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Precio por Noche</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
                value={formData.precio_por_noche}
                onChange={(e) => setFormData({ ...formData, precio_por_noche: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Descripción</label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Características, amenities, etc."
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                />
                <span className="text-sm font-medium text-foreground">Habitación activa</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-card">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
              Guardar Habitación
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
