"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Plus, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  lead?: any
  paquetesDisponibles?: any[]
  vendedores?: any[]
}

interface Acompanante {
  id?: string
  nombre: string
  apellido: string
  documento: string
  email: string
  telefono: string
  direccion: string
  edad: number | null
}

type TabType = "tipo-reserva" | "datos-personales" | "datos-viaje" | "venta" | "acompanantes"

const MAX_ACOMPANANTES = 10

export function LeadModal({ isOpen, onClose, onSubmit, lead, paquetesDisponibles = [], vendedores = [] }: LeadModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("tipo-reserva")
  const [posadas, setPosadas] = useState<any[]>([])
  const [habitaciones, setHabitaciones] = useState<any[]>([])
  const [acompanantes, setAcompanantes] = useState<Acompanante[]>([])
  const [acompanantesOriginales, setAcompanantesOriginales] = useState<Acompanante[]>([])
  const [tiposPaquete, setTiposPaquete] = useState<any[]>([])
  const [stockInfo, setStockInfo] = useState<any>(null)
  const [stockWarning, setStockWarning] = useState<string>("")

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
    vendedorColaborador: "",
    estado: "Nuevo",
    notasInternas: "",
    paqueteSugerido: "",
    tipoPaqueteSeleccionado: "",
    // Nuevos campos
    fechaViajeInicio: "",
    fechaViajeFin: "",
    mesViaje: "",
    numeroHuespedes: 1,
    tipo: "",
    posadaId: "",
    habitacionId: "",
    fechaVenta: "",
    total: 0,
    sena: 0,
  })

  // Cargar posadas, habitaciones, tipos de paquete y acompañantes
  useEffect(() => {
    if (isOpen) {
      fetchPosadas()
      fetchHabitaciones()
      fetchTiposPaquete()
      if (lead?.id) {
        fetchAcompanantes(lead.id)
      }
    }
  }, [isOpen, lead])

  const fetchPosadas = async () => {
    try {
      const { data, error } = await supabase
        .from("posadas")
        .select("id, nombre")
        .eq("activo", true)
        .order("nombre", { ascending: true })

      if (error) throw error
      setPosadas(data || [])
    } catch (error) {
      console.error("Error al cargar posadas:", error)
    }
  }

  const fetchHabitaciones = async () => {
    try {
      const { data, error } = await supabase
        .from("habitaciones")
        .select("id, nombre, tipo_habitacion")
        .eq("activo", true)
        .order("nombre", { ascending: true })

      if (error) throw error
      setHabitaciones(data || [])
    } catch (error) {
      console.error("Error al cargar habitaciones:", error)
    }
  }

  const fetchTiposPaquete = async () => {
    try {
      const { data, error } = await supabase
        .from("tipos_de_paquete")
        .select("*")
        .order("nombre", { ascending: true })

      if (error) throw error
      setTiposPaquete(data || [])
    } catch (error) {
      console.error("Error al cargar tipos de paquete:", error)
    }
  }

  const fetchAcompanantes = async (leadId: string) => {
    try {
      const { data, error } = await supabase
        .from("acompanantes")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: true })

      if (error) throw error
      const acompanantesData = (data || []).map((a: any) => ({
        id: a.id,
        nombre: a.nombre || "",
        apellido: a.apellido || "",
        documento: a.documento || "",
        email: a.email || "",
        telefono: a.telefono || "",
        direccion: a.direccion || "",
        edad: a.edad || null,
      }))
      setAcompanantes(acompanantesData)
      setAcompanantesOriginales(JSON.parse(JSON.stringify(acompanantesData)))
    } catch (error) {
      console.error("Error al cargar acompañantes:", error)
    }
  }

  // Verificar stock cuando cambia el paquete o tipo de paquete
  const verificarStockDisponible = async (paqueteId: string, tipoPaqueteId: string) => {
    if (!paqueteId || !tipoPaqueteId) {
      setStockInfo(null)
      setStockWarning("")
      return
    }

    try {
      // Obtener el nombre del tipo de paquete
      const tipoPaquete = tiposPaquete.find(t => t.id === tipoPaqueteId)
      if (!tipoPaquete) return

      // Obtener stock del paquete
      const { data: paquete, error } = await supabase
        .from("paquetes")
        .select("stock_vuelos, stock_hospedaje")
        .eq("id", paqueteId)
        .single()

      if (error) throw error

      const stockVuelos = (paquete as any).stock_vuelos || 0
      const stockHospedaje = (paquete as any).stock_hospedaje || 0

      setStockInfo({
        vuelos: stockVuelos,
        hospedaje: stockHospedaje,
      })

      // Validar según el tipo de paquete
      switch (tipoPaquete.nombre) {
        case "Solo Vuelo":
          if (stockVuelos <= 0) {
            setStockWarning("⚠️ No hay stock disponible para vuelos")
          } else if (stockVuelos <= 3) {
            setStockWarning(`⚠️ Stock bajo: Solo quedan ${stockVuelos} vuelo(s) disponibles`)
          } else {
            setStockWarning(`✓ Stock disponible: ${stockVuelos} vuelo(s)`)
          }
          break
        case "Solo Hospedaje":
          if (stockHospedaje <= 0) {
            setStockWarning("⚠️ No hay stock disponible para hospedaje")
          } else if (stockHospedaje <= 3) {
            setStockWarning(`⚠️ Stock bajo: Solo quedan ${stockHospedaje} cama(s) disponibles`)
          } else {
            setStockWarning(`✓ Stock disponible: ${stockHospedaje} cama(s)`)
          }
          break
        case "Vuelo + Hospedaje":
          if (stockVuelos <= 0 || stockHospedaje <= 0) {
            if (stockVuelos <= 0 && stockHospedaje <= 0) {
              setStockWarning("⚠️ No hay stock disponible para vuelos ni hospedaje")
            } else if (stockVuelos <= 0) {
              setStockWarning("⚠️ No hay stock disponible para vuelos")
            } else {
              setStockWarning("⚠️ No hay stock disponible para hospedaje")
            }
          } else if (stockVuelos <= 3 || stockHospedaje <= 3) {
            setStockWarning(`⚠️ Stock bajo: ${stockVuelos} vuelo(s) y ${stockHospedaje} cama(s) disponibles`)
          } else {
            setStockWarning(`✓ Stock disponible: ${stockVuelos} vuelo(s) y ${stockHospedaje} cama(s)`)
          }
          break
      }
    } catch (error) {
      console.error("Error al verificar stock:", error)
      setStockWarning("Error al verificar stock")
    }
  }

  // Efecto para verificar stock cuando cambia el paquete o tipo de paquete
  useEffect(() => {
    if (formData.paqueteSugerido && formData.tipoPaqueteSeleccionado) {
      verificarStockDisponible(formData.paqueteSugerido, formData.tipoPaqueteSeleccionado)
    }
  }, [formData.paqueteSugerido, formData.tipoPaqueteSeleccionado, tiposPaquete])

  // Funciones para manejar acompañantes
  const agregarAcompanante = () => {
    if (acompanantes.length >= MAX_ACOMPANANTES) {
      return
    }
    setAcompanantes([
      ...acompanantes,
      {
        nombre: "",
        apellido: "",
        documento: "",
        email: "",
        telefono: "",
        direccion: "",
        edad: null,
      }
    ])
  }

  const eliminarAcompanante = (index: number) => {
    setAcompanantes(acompanantes.filter((_, i) => i !== index))
  }

  const actualizarAcompanante = (index: number, field: keyof Acompanante, value: any) => {
    const nuevosAcompanantes = [...acompanantes]
    nuevosAcompanantes[index] = {
      ...nuevosAcompanantes[index],
      [field]: value
    }
    setAcompanantes(nuevosAcompanantes)
  }

  // Calcular mes de viaje automáticamente
  const calcularMesViaje = (fechaInicio: string) => {
    if (!fechaInicio) return ""
    const fecha = new Date(fechaInicio)
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]
    return meses[fecha.getMonth()]
  }

  // Manejar cambio de fecha de inicio
  const handleFechaInicioChange = (fecha: string) => {
    setFormData({
      ...formData,
      fechaViajeInicio: fecha,
      mesViaje: calcularMesViaje(fecha)
    })
  }

  // Cargar datos del lead al editar
  useEffect(() => {
    if (lead && isOpen) {
      setFormData({
        nombre: lead.nombre || "",
        apellido: lead.apellido || "",
        email: lead.email || "",
        telefono: lead.telefono || "",
        pais: lead.pais || "",
        ciudad: lead.ciudad || "",
        tipoConsulta: lead.tipo_consulta || lead.tipoConsulta || "Paquete turístico",
        origen: lead.origen || "Web",
        vendedorAsignado: lead.vendedor_asignado_id || lead.vendedorAsignado || "",
        vendedorColaborador: lead.vendedor_colaborador_id || lead.vendedorColaborador || "",
        estado: lead.estado || "Nuevo",
        notasInternas: lead.notas_internas || lead.notasInternas || "",
        paqueteSugerido: lead.paquete_sugerido_id || lead.paqueteSugerido || "",
        tipoPaqueteSeleccionado: lead.tipo_paquete_seleccionado || "",
        fechaViajeInicio: lead.fecha_viaje_inicio || "",
        fechaViajeFin: lead.fecha_viaje_fin || "",
        mesViaje: lead.mes_viaje || "",
        numeroHuespedes: lead.numero_huespedes || 1,
        tipo: lead.tipo || "",
        posadaId: lead.pousada_id || "",
        habitacionId: lead.habitacion_id || "",
        fechaVenta: lead.fecha_venta || "",
        total: lead.total || 0,
        sena: lead.sena || 0,
      })
    } else if (!isOpen) {
      // Reset form, tab y acompañantes cuando se cierra el modal
      setActiveTab("tipo-reserva")
      setAcompanantes([])
      setAcompanantesOriginales([])
      setStockInfo(null)
      setStockWarning("")
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
        vendedorColaborador: "",
        estado: "Nuevo",
        notasInternas: "",
        paqueteSugerido: "",
        tipoPaqueteSeleccionado: "",
        fechaViajeInicio: "",
        fechaViajeFin: "",
        mesViaje: "",
        numeroHuespedes: 1,
        tipo: "",
        posadaId: "",
        habitacionId: "",
        fechaVenta: "",
        total: 0,
        sena: 0,
      })
    }
  }, [lead, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar stock antes de enviar
    if (formData.paqueteSugerido && formData.tipoPaqueteSeleccionado && stockInfo) {
      const tipoPaquete = tiposPaquete.find(t => t.id === formData.tipoPaqueteSeleccionado)
      if (tipoPaquete) {
        let sinStock = false
        switch (tipoPaquete.nombre) {
          case "Solo Vuelo":
            if (stockInfo.vuelos <= 0) sinStock = true
            break
          case "Solo Hospedaje":
            if (stockInfo.hospedaje <= 0) sinStock = true
            break
          case "Vuelo + Hospedaje":
            if (stockInfo.vuelos <= 0 || stockInfo.hospedaje <= 0) sinStock = true
            break
        }

        if (sinStock) {
          alert("No se puede crear el lead: No hay stock disponible para el tipo de paquete seleccionado")
          return
        }
      }
    }

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
      // Nuevos campos
      fecha_viaje_inicio: formData.fechaViajeInicio || null,
      fecha_viaje_fin: formData.fechaViajeFin || null,
      mes_viaje: formData.mesViaje || null,
      numero_huespedes: formData.numeroHuespedes,
      tipo: formData.tipo || null,
      fecha_venta: formData.fechaVenta || null,
      total: formData.total,
      sena: formData.sena,
    }

    // Solo agregar vendedor_asignado_id si se seleccionó un vendedor
    if (formData.vendedorAsignado) {
      dataToSubmit.vendedor_asignado_id = formData.vendedorAsignado
    }

    // Solo agregar vendedor_colaborador_id si se seleccionó un vendedor colaborador
    if (formData.vendedorColaborador) {
      dataToSubmit.vendedor_colaborador_id = formData.vendedorColaborador
    }

    // Solo agregar paquete_sugerido_id si se seleccionó un paquete
    if (formData.paqueteSugerido) {
      dataToSubmit.paquete_sugerido_id = formData.paqueteSugerido
    }

    // Solo agregar tipo_paquete_seleccionado si se seleccionó un tipo
    if (formData.tipoPaqueteSeleccionado) {
      dataToSubmit.tipo_paquete_seleccionado = formData.tipoPaqueteSeleccionado
    }

    // Solo agregar posada_id si se seleccionó una posada
    if (formData.posadaId) {
      dataToSubmit.pousada_id = formData.posadaId
    }

    // Solo agregar habitacion_id si se seleccionó una habitación
    if (formData.habitacionId) {
      dataToSubmit.habitacion_id = formData.habitacionId
    }

    // Agregar acompañantes (se guardarán después del lead)
    dataToSubmit.acompanantes = acompanantes

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
      vendedorColaborador: "",
      estado: "Nuevo",
      notasInternas: "",
      paqueteSugerido: "",
      tipoPaqueteSeleccionado: "",
      fechaViajeInicio: "",
      fechaViajeFin: "",
      mesViaje: "",
      numeroHuespedes: 1,
      tipo: "",
      posadaId: "",
      habitacionId: "",
      fechaVenta: "",
      total: 0,
      sena: 0,
    })
  }

  if (!isOpen) return null

  const estados = ["Nuevo", "En gestión", "Cotizado", "Cerrado – Pendiente Administración", "Finalizado", "Perdido"]
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

  const tabs = [
    { id: "tipo-reserva" as TabType, label: "Tipo de Reserva" },
    { id: "datos-personales" as TabType, label: "Datos Personales" },
    { id: "datos-viaje" as TabType, label: "Datos del Viaje" },
    { id: "venta" as TabType, label: "Venta" },
    { id: "acompanantes" as TabType, label: "Acompañantes" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-lg w-full sm:w-[90%] md:w-[700px] max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-card rounded-t-2xl sm:rounded-t-lg">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">{lead ? "Editar Lead" : "Nuevo Lead"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground hover:bg-muted">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-border bg-muted/30">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600 dark:text-orange-400 bg-background"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4">
            {/* SOLAPA 1: TIPO DE RESERVA */}
            {activeTab === "tipo-reserva" && (
              <>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Tipo de Lead</label>
                    <select
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="NOMINA">NÓMINA</option>
                      <option value="INDIVIDUAL">INDIVIDUAL</option>
                      <option value="HOSPEDAJE">HOSPEDAJE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Paquete Sugerido</label>
                  <select
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.paqueteSugerido}
                    onChange={(e) => {
                      setFormData({ ...formData, paqueteSugerido: e.target.value, tipoPaqueteSeleccionado: "" })
                      setStockWarning("")
                      setStockInfo(null)
                    }}
                  >
                    <option value="">Selecciona paquete</option>
                    {paquetesDisponibles.map((paquete) => (
                      <option key={paquete.id} value={paquete.id}>
                        {paquete.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Paquete - Solo se muestra si se seleccionó un paquete */}
                {formData.paqueteSugerido && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Tipo de Paquete *</label>
                    <select
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.tipoPaqueteSeleccionado}
                      onChange={(e) => setFormData({ ...formData, tipoPaqueteSeleccionado: e.target.value })}
                      required={!!formData.paqueteSugerido}
                    >
                      <option value="">Selecciona tipo de paquete</option>
                      {tiposPaquete.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                    {formData.tipoPaqueteSeleccionado && stockWarning && (
                      <div className={`mt-2 p-3 rounded-lg text-sm ${
                        stockWarning.startsWith("✓")
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                          : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                      }`}>
                        {stockWarning}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* SOLAPA 2: DATOS PERSONALES */}
            {activeTab === "datos-personales" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nombre *</label>
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
                    <label className="block text-sm font-medium text-foreground mb-2">Apellido *</label>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
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
                    <label className="block text-sm font-medium text-foreground mb-2">Teléfono *</label>
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
              </>
            )}

            {/* SOLAPA 3: DATOS DEL VIAJE */}
            {activeTab === "datos-viaje" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Fecha de Viaje - Inicio</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.fechaViajeInicio}
                      onChange={(e) => handleFechaInicioChange(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Fecha de Viaje - Fin</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.fechaViajeFin}
                      onChange={(e) => setFormData({ ...formData, fechaViajeFin: e.target.value })}
                    />
                  </div>
                </div>

                {formData.mesViaje && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Mes de Viaje</label>
                    <div className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-foreground">
                      {formData.mesViaje}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Número de Huéspedes</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.numeroHuespedes}
                    onChange={(e) => setFormData({ ...formData, numeroHuespedes: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Pousada</label>
                    <select
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.posadaId}
                      onChange={(e) => setFormData({ ...formData, posadaId: e.target.value })}
                    >
                      <option value="">Seleccionar posada</option>
                      {posadas.map((posada) => (
                        <option key={posada.id} value={posada.id}>
                          {posada.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Habitación</label>
                    <select
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.habitacionId}
                      onChange={(e) => setFormData({ ...formData, habitacionId: e.target.value })}
                    >
                      <option value="">Seleccionar habitación</option>
                      {habitaciones.map((habitacion) => (
                        <option key={habitacion.id} value={habitacion.id}>
                          {habitacion.nombre} {habitacion.tipo_habitacion ? `- ${habitacion.tipo_habitacion}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* SOLAPA 4: VENTA */}
            {activeTab === "venta" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Vendedor Asignado *</label>
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
                    <label className="block text-sm font-medium text-foreground mb-2">Vendedor Colaborador</label>
                    <select
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.vendedorColaborador}
                      onChange={(e) => setFormData({ ...formData, vendedorColaborador: e.target.value })}
                    >
                      <option value="">Selecciona vendedor colaborador</option>
                      {vendedores
                        .filter((vendedor) => vendedor.id !== formData.vendedorAsignado)
                        .map((vendedor) => (
                          <option key={vendedor.id} value={vendedor.id}>
                            {vendedor.nombre} {vendedor.apellido}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Fecha de Venta</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.fechaVenta}
                    onChange={(e) => setFormData({ ...formData, fechaVenta: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Total</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0.00"
                      value={formData.total}
                      onChange={(e) => setFormData({ ...formData, total: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Seña</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0.00"
                      value={formData.sena}
                      onChange={(e) => setFormData({ ...formData, sena: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Saldo</label>
                    <div className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-foreground font-semibold">
                      ${(formData.total - formData.sena).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Notas Internas</label>
                  <textarea
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none h-24"
                    placeholder="Notas internas del lead..."
                    value={formData.notasInternas}
                    onChange={(e) => setFormData({ ...formData, notasInternas: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* SOLAPA 5: ACOMPAÑANTES */}
            {activeTab === "acompanantes" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      Acompañantes ({acompanantes.length}/{MAX_ACOMPANANTES})
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Agrega hasta {MAX_ACOMPANANTES} acompañantes para este lead
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={agregarAcompanante}
                    disabled={acompanantes.length >= MAX_ACOMPANANTES}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                </div>

                {acompanantes.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground mb-4">No hay acompañantes agregados</p>
                    <Button
                      type="button"
                      onClick={agregarAcompanante}
                      variant="outline"
                      className="text-foreground border-border"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar primer acompañante
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {acompanantes.map((acompanante, index) => (
                      <div
                        key={index}
                        className="p-4 border border-border rounded-lg bg-muted/30 space-y-3"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-foreground">
                            Acompañante #{index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => eliminarAcompanante(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1">
                              Nombre
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Nombre"
                              value={acompanante.nombre}
                              onChange={(e) => actualizarAcompanante(index, "nombre", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1">
                              Apellido
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Apellido"
                              value={acompanante.apellido}
                              onChange={(e) => actualizarAcompanante(index, "apellido", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1">
                              Documento
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="DNI, Pasaporte, etc."
                              value={acompanante.documento}
                              onChange={(e) => actualizarAcompanante(index, "documento", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1">
                              Edad
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="120"
                              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Edad"
                              value={acompanante.edad || ""}
                              onChange={(e) =>
                                actualizarAcompanante(index, "edad", e.target.value ? parseInt(e.target.value) : null)
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="email@example.com"
                              value={acompanante.email}
                              onChange={(e) => actualizarAcompanante(index, "email", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1">
                              Teléfono
                            </label>
                            <input
                              type="tel"
                              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="+34 612 345 678"
                              value={acompanante.telefono}
                              onChange={(e) => actualizarAcompanante(index, "telefono", e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1">
                            Dirección
                          </label>
                          <textarea
                            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none h-16"
                            placeholder="Dirección completa"
                            value={acompanante.direccion}
                            onChange={(e) => actualizarAcompanante(index, "direccion", e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Botones */}
          <div className="border-t border-border p-4 sm:p-6 bg-muted/30">
            <div className="flex gap-3">
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
          </div>
        </form>
      </div>
    </div>
  )
}
