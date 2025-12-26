"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface PosadaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  posada?: any
}

export function PosadaModal({ isOpen, onClose, onSubmit, posada }: PosadaModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    estrellas: 0,
    telefono: "",
    email: "",
    precio_referencia: 0,
    activo: true,
    notas: "",
  })

  useEffect(() => {
    if (posada && isOpen) {
      setFormData({
        nombre: posada.nombre || "",
        ubicacion: posada.ubicacion || "",
        estrellas: posada.estrellas || 0,
        telefono: posada.telefono || "",
        email: posada.email || "",
        precio_referencia: posada.precio_referencia || 0,
        activo: posada.activo ?? true,
        notas: posada.notas || "",
      })
    } else if (!isOpen) {
      resetForm()
    }
  }, [posada, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      ubicacion: "",
      estrellas: 0,
      telefono: "",
      email: "",
      precio_referencia: 0,
      activo: true,
      notas: "",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-lg w-full sm:w-[600px] max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card rounded-t-2xl sm:rounded-t-lg">
          <h2 className="text-xl font-bold text-foreground">
            {posada ? "Editar Posada" : "Nueva Posada"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground hover:bg-muted">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Nombre de la Posada *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Hotel Example"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Ubicación</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ciudad, País"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Categoría (Estrellas)</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.estrellas}
                onChange={(e) => setFormData({ ...formData, estrellas: parseInt(e.target.value) })}
              >
                <option value={0}>Sin categoría</option>
                <option value={1}>⭐ 1 Estrella</option>
                <option value={2}>⭐⭐ 2 Estrellas</option>
                <option value={3}>⭐⭐⭐ 3 Estrellas</option>
                <option value={4}>⭐⭐⭐⭐ 4 Estrellas</option>
                <option value={5}>⭐⭐⭐⭐⭐ 5 Estrellas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Precio Referencia</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
                value={formData.precio_referencia}
                onChange={(e) => setFormData({ ...formData, precio_referencia: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Teléfono</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+123 456 7890"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="info@posada.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Notas</label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Información adicional..."
                rows={3}
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
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
                <span className="text-sm font-medium text-foreground">Posada activa</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-card">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
              Guardar Posada
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
