"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Sucursal } from "@/types"

interface VendedorModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  vendedor?: any
  sucursales?: Sucursal[]
}

export function VendedorModal({ isOpen, onClose, onSubmit, vendedor, sucursales = [] }: VendedorModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    whatsapp: "",
    email: "",
    sucursal_id: "",
  })

  // Actualizar el formulario cuando cambie el vendedor
  useEffect(() => {
    if (vendedor) {
      setFormData({
        nombre: vendedor.nombre || "",
        apellido: vendedor.apellido || "",
        whatsapp: vendedor.whatsapp || "",
        email: vendedor.email || "",
        sucursal_id: vendedor.sucursal_id || "",
      })
    } else {
      setFormData({
        nombre: "",
        apellido: "",
        whatsapp: "",
        email: "",
        sucursal_id: "",
      })
    }
  }, [vendedor, isOpen])

  const isEditing = !!vendedor

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.email.trim() || !formData.whatsapp.trim()) {
      alert("Por favor completa todos los campos")
      return
    }

    // Preparar datos para enviar - solo incluir sucursal_id si tiene valor
    const dataToSubmit: any = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      whatsapp: formData.whatsapp,
      email: formData.email,
    }

    // Solo agregar sucursal_id si se seleccionó una sucursal
    if (formData.sucursal_id) {
      dataToSubmit.sucursal_id = formData.sucursal_id
    }

    onSubmit(dataToSubmit)
    setFormData({ nombre: "", apellido: "", whatsapp: "", email: "", sucursal_id: "" })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-lg w-full sm:w-96 max-h-[90vh] sm:max-h-none overflow-y-auto shadow-lg">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card rounded-t-2xl sm:rounded-t-lg">
          <h2 className="text-xl font-bold text-foreground">{isEditing ? "Editar Vendedor" : "Nuevo Vendedor"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground hover:bg-muted">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nombre</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Apellido</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">WhatsApp</label>
            <input
              type="tel"
              required
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+34 612 345 678"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Sucursal / Área</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.sucursal_id}
              onChange={(e) => setFormData({ ...formData, sucursal_id: e.target.value })}
            >
              <option value="">Seleccionar sucursal</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.id} value={sucursal.id}>
                  {sucursal.nombre}
                </option>
              ))}
            </select>
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
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {isEditing ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
