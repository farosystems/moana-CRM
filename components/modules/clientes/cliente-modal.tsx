"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ClienteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  cliente?: any
  vendedores?: any[]
}

export function ClienteModal({ isOpen, onClose, onSubmit, cliente, vendedores = [] }: ClienteModalProps) {
  const [activeTab, setActiveTab] = useState("basico")
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    ciudad: "",
    pais: "",
    telefono: "",
    whatsapp: "",
    tipoCliente: "empresa",
    vendedorId: "",
    // Documentación
    documentoId: "",
    tipoDocumento: "pasaporte",
    paisDocumento: "",
    // Preferencias de viaje
    destinosPreferidos: "",
    tipoViajes: [] as string[],
    presupuestoPromedio: "",
    frecuenciaViajes: "ocasional",
    notas: "",
  })

  // Cargar datos del cliente al editar
  useEffect(() => {
    if (cliente && isOpen) {
      setFormData({
        nombre: cliente.nombre || "",
        email: cliente.email || "",
        ciudad: cliente.ciudad || "",
        pais: cliente.pais || "",
        telefono: cliente.telefono || "",
        whatsapp: cliente.whatsapp || "",
        tipoCliente: cliente.tipo_cliente || "empresa",
        vendedorId: cliente.vendedor_id || "",
        documentoId: cliente.documento_id || "",
        tipoDocumento: cliente.tipo_documento || "pasaporte",
        paisDocumento: "",
        destinosPreferidos: cliente.destinos_preferidos || "",
        tipoViajes: cliente.tipo_viajes || [],
        presupuestoPromedio: cliente.presupuesto_promedio || "",
        frecuenciaViajes: cliente.frecuencia_viajes || "ocasional",
        notas: "",
      })
    } else if (!isOpen) {
      // Reset form cuando se cierra el modal
      resetForm()
    }
  }, [cliente, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mapear campos de camelCase a snake_case para la base de datos
    const dataToSubmit: any = {
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      tipo_cliente: formData.tipoCliente,
    }

    // Campos opcionales
    if (formData.ciudad) dataToSubmit.ciudad = formData.ciudad
    if (formData.pais) dataToSubmit.pais = formData.pais
    if (formData.whatsapp) dataToSubmit.whatsapp = formData.whatsapp
    if (formData.vendedorId) dataToSubmit.vendedor_id = formData.vendedorId
    if (formData.documentoId) dataToSubmit.documento_id = formData.documentoId
    if (formData.tipoDocumento) dataToSubmit.tipo_documento = formData.tipoDocumento
    if (formData.destinosPreferidos) dataToSubmit.destinos_preferidos = formData.destinosPreferidos
    if (formData.tipoViajes.length > 0) dataToSubmit.tipo_viajes = formData.tipoViajes
    if (formData.presupuestoPromedio) dataToSubmit.presupuesto_promedio = formData.presupuestoPromedio
    if (formData.frecuenciaViajes) dataToSubmit.frecuencia_viajes = formData.frecuenciaViajes
    // Nota: el campo 'notas' no existe en la tabla clientes

    onSubmit(dataToSubmit)
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
      vendedorId: "",
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
          <h2 className="text-xl font-bold text-foreground">{cliente ? "Editar Cliente" : "Nuevo Cliente"}</h2>
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
                <label className="block text-sm font-medium text-foreground mb-2">Vendedor Asignado</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.vendedorId}
                  onChange={(e) => setFormData({ ...formData, vendedorId: e.target.value })}
                >
                  <option value="">Seleccionar vendedor</option>
                  {vendedores.map((vendedor) => (
                    <option key={vendedor.id} value={vendedor.id}>
                      {vendedor.nombre} {vendedor.apellido}
                    </option>
                  ))}
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
