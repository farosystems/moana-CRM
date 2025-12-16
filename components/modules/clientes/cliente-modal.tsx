"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ClienteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

export function ClienteModal({ isOpen, onClose, onSubmit }: ClienteModalProps) {
  const [activeTab, setActiveTab] = useState("basico")
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    ciudad: "",
    pais: "",
    telefono: "",
    whatsapp: "",
    tipoCliente: "empresa",
    // Documentación
    documentoId: "",
    tipoDocumento: "pasaporte",
    paisDocumento: "",
    // Preferencias de viaje
    destinosPreferidos: "",
    tipoViajes: [],
    presupuestoPromedio: "",
    frecuenciaViajes: "ocasional",
    notas: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      email: "",
      ciudad: "",
      pais: "",
      telefono: "",
      whatsapp: "",
      tipoCliente: "empresa",
      documentoId: "",
      tipoDocumento: "pasaporte",
      paisDocumento: "",
      destinosPreferidos: "",
      tipoViajes: [],
      presupuestoPromedio: "",
      frecuenciaViajes: "ocasional",
      notas: "",
    })
    setActiveTab("basico")
  }

  const handleCheckboxChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      tipoViajes: prev.tipoViajes.includes(value)
        ? prev.tipoViajes.filter((v) => v !== value)
        : [...prev.tipoViajes, value],
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-lg w-full sm:w-[600px] max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card rounded-t-2xl sm:rounded-t-lg">
          <h2 className="text-xl font-bold text-foreground">Nuevo Cliente</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground hover:bg-muted">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-muted/30 px-6">
          <button
            onClick={() => setActiveTab("basico")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "basico"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Datos Básicos
          </button>
          <button
            onClick={() => setActiveTab("documentos")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "documentos"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Documentación
          </button>
          <button
            onClick={() => setActiveTab("preferencias")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "preferencias"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Preferencias
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* TAB 1: Datos Básicos */}
          {activeTab === "basico" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tipo de Cliente</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.tipoCliente}
                  onChange={(e) => setFormData({ ...formData, tipoCliente: e.target.value })}
                >
                  <option value="empresa">Empresa</option>
                  <option value="persona">Persona</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nombre Completo</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={formData.tipoCliente === "empresa" ? "Nombre de la empresa" : "Nombre completo"}
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+34 612 345 678"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">WhatsApp</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+34 612 345 678"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Ciudad</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ciudad"
                    value={formData.ciudad}
                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">País</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="País"
                    value={formData.pais}
                    onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Documentación */}
          {activeTab === "documentos" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tipo de Documento</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.tipoDocumento}
                  onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value })}
                >
                  <option value="pasaporte">Pasaporte</option>
                  <option value="cedula">Cédula</option>
                  <option value="nif">NIF</option>
                  <option value="rut">RUT</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Número de Documento</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Número de documento"
                  value={formData.documentoId}
                  onChange={(e) => setFormData({ ...formData, documentoId: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">País de Emisión</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="País"
                  value={formData.paisDocumento}
                  onChange={(e) => setFormData({ ...formData, paisDocumento: e.target.value })}
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  Los datos de documentación se pueden actualizar directamente en el perfil del cliente.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Preferencias de Viaje */}
          {activeTab === "preferencias" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Destinos Preferidos</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: París, Barcelona, Miami (separados por comas)"
                  value={formData.destinosPreferidos}
                  onChange={(e) => setFormData({ ...formData, destinosPreferidos: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tipo de Viajes</label>
                <div className="space-y-2">
                  {["Playa", "Montaña", "Ciudad", "Aventura", "Relax", "Negocios"].map((tipo) => (
                    <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.tipoViajes.includes(tipo)}
                        onChange={() => handleCheckboxChange(tipo)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm text-foreground">{tipo}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Presupuesto Promedio</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.presupuestoPromedio}
                  onChange={(e) => setFormData({ ...formData, presupuestoPromedio: e.target.value })}
                >
                  <option value="">Seleccionar...</option>
                  <option value="bajo">Bajo (&lt;$1000)</option>
                  <option value="medio">Medio ($1000 - $5000)</option>
                  <option value="alto">Alto ($5000 - $15000)</option>
                  <option value="premium">Premium (&gt;$15000)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Frecuencia de Viajes</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.frecuenciaViajes}
                  onChange={(e) => setFormData({ ...formData, frecuenciaViajes: e.target.value })}
                >
                  <option value="ocasional">Ocasional</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="mensual">Mensual</option>
                  <option value="semanal">Semanal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Notas</label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Notas adicionales sobre preferencias..."
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-foreground border-border hover:bg-muted bg-transparent"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
              Guardar Cliente
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
