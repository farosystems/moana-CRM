"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  paquetesDisponibles?: any[]
  vendedores?: any[]
}

export function LeadModal({ isOpen, onClose, onSubmit, paquetesDisponibles = [], vendedores = [] }: LeadModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    pais: "",
    ciudad: "",
    tipoConsulta: "Paquete turístico",
    origen: "Web",
    vendedorAsignado: "",
    estado: "Nuevo",
    notasInternas: "",
    paqueteSugerido: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mapear campos de camelCase a snake_case para la base de datos
    const dataToSubmit: any = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      pais: formData.pais,
      ciudad: formData.ciudad,
      tipo_consulta: formData.tipoConsulta,
      origen: formData.origen,
      estado: formData.estado,
      notas_internas: formData.notasInternas,
    }

    // Solo agregar vendedor_asignado_id si se seleccionó un vendedor
    if (formData.vendedorAsignado) {
      dataToSubmit.vendedor_asignado_id = formData.vendedorAsignado
    }

    // Solo agregar paquete_sugerido_id si se seleccionó un paquete
    if (formData.paqueteSugerido) {
      dataToSubmit.paquete_sugerido_id = formData.paqueteSugerido
    }

    onSubmit(dataToSubmit)
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      pais: "",
      ciudad: "",
      tipoConsulta: "Paquete turístico",
      origen: "Web",
      vendedorAsignado: "",
      estado: "Nuevo",
      notasInternas: "",
      paqueteSugerido: "",
    })
  }

  if (!isOpen) return null

  const estados = ["Nuevo", "En gestión", "Cotizado", "Cerrado ganado", "Cerrado perdido"]
  const tiposConsulta = ["Paquete turístico", "Vuelo", "Hotel", "Transporte", "Actividades", "Seguros", "Otro"]
  const origenes = ["Web", "Instagram", "WhatsApp", "Campaña", "Directo", "Referencia"]

  const paises = [
    "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba", "Ecuador", "El Salvador",
    "Guatemala", "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "Puerto Rico",
    "República Dominicana", "Uruguay", "Venezuela", "España", "Estados Unidos", "Canadá", "Alemania",
    "Francia", "Italia", "Portugal", "Reino Unido", "Países Bajos", "Bélgica", "Suiza", "Austria",
    "Suecia", "Noruega", "Dinamarca", "Finlandia", "Irlanda", "Polonia", "Grecia", "Turquía",
    "Rusia", "China", "Japón", "Corea del Sur", "India", "Tailandia", "Vietnam", "Filipinas",
    "Indonesia", "Malasia", "Singapur", "Australia", "Nueva Zelanda", "Sudáfrica", "Egipto",
    "Marruecos", "Emiratos Árabes Unidos", "Arabia Saudita", "Israel", "Otros"
  ].sort()

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-lg w-full sm:w-[90%] md:w-[600px] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b border-border bg-card rounded-t-2xl sm:rounded-t-lg">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Nuevo Lead</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground hover:bg-muted">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nombre</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              />
            </div>
          </div>

          {/* Email y Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Teléfono</label>
              <input
                type="tel"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="+34 612 345 678"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>
          </div>

          {/* País y Ciudad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">País</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.pais}
                onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              >
                <option value="">Selecciona país</option>
                {paises.map((pais) => (
                  <option key={pais} value={pais}>
                    {pais}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Ciudad</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ciudad"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              />
            </div>
          </div>

          {/* Tipo de Consulta y Origen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tipo de Consulta</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.tipoConsulta}
                onChange={(e) => setFormData({ ...formData, tipoConsulta: e.target.value })}
              >
                {tiposConsulta.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Origen</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.origen}
                onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
              >
                {origenes.map((origen) => (
                  <option key={origen} value={origen}>
                    {origen}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vendedor Asignado y Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Vendedor Asignado</label>
              <select
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.vendedorAsignado}
                onChange={(e) => setFormData({ ...formData, vendedorAsignado: e.target.value })}
              >
                <option value="">Selecciona vendedor</option>
                {vendedores.map((vendedor) => (
                  <option key={vendedor.id} value={vendedor.id}>
                    {vendedor.nombre} {vendedor.apellido}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Estado</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              >
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Paquete Sugerido */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Paquete Sugerido</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.paqueteSugerido}
              onChange={(e) => setFormData({ ...formData, paqueteSugerido: e.target.value })}
            >
              <option value="">Selecciona paquete</option>
              {paquetesDisponibles.map((paquete) => (
                <option key={paquete.id} value={paquete.id}>
                  {paquete.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Notas Internas */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Notas Internas</label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none h-24"
              placeholder="Notas internas del lead..."
              value={formData.notasInternas}
              onChange={(e) => setFormData({ ...formData, notasInternas: e.target.value })}
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
            <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
              Guardar Lead
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
