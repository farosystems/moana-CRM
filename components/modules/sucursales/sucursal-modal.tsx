"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Sucursal } from "@/types"
import { toast } from "sonner"

interface SucursalModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  sucursal?: Sucursal
}

export function SucursalModal({ isOpen, onClose, onSubmit, sucursal }: SucursalModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    direccion: "",
    ciudad: "",
    pais: "",
    telefono: "",
    email: "",
  })

  // Actualizar el formulario cuando cambie la sucursal
  useEffect(() => {
    if (sucursal) {
      setFormData({
        nombre: sucursal.nombre || "",
        codigo: sucursal.codigo || "",
        direccion: sucursal.direccion || "",
        ciudad: sucursal.ciudad || "",
        pais: sucursal.pais || "",
        telefono: sucursal.telefono || "",
        email: sucursal.email || "",
      })
    } else {
      setFormData({
        nombre: "",
        codigo: "",
        direccion: "",
        ciudad: "",
        pais: "",
        telefono: "",
        email: "",
      })
    }
  }, [sucursal, isOpen])

  const isEditing = !!sucursal

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre.trim() || !formData.codigo.trim()) {
      toast.error("Por favor completa los campos obligatorios (Nombre y Código)")
      return
    }

    onSubmit(formData)
    setFormData({ nombre: "", codigo: "", direccion: "", ciudad: "", pais: "", telefono: "", email: "" })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-lg w-full sm:w-[500px] max-h-[90vh] sm:max-h-none overflow-y-auto shadow-lg">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card rounded-t-2xl sm:rounded-t-lg">
          <h2 className="text-xl font-bold text-foreground">
            {isEditing ? "Editar Sucursal" : "Nueva Sucursal"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground hover:bg-muted">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Buenos Aires Centro"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Código <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="BSAS-CTR"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Dirección</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Av. Corrientes 1234"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Ciudad</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Buenos Aires"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">País</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Argentina"
                value={formData.pais}
                onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Teléfono</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="+54 11 1234 5678"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="sucursal@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-foreground border-border hover:bg-muted bg-transparent"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
              {isEditing ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
