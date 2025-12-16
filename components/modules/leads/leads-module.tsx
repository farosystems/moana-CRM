"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LeadsTable } from "./leads-table"
import { LeadModal } from "./lead-modal"
import { LeadHistory } from "./lead-history"
import { ImportLeadsModal } from "./import-leads-modal"
import { AssignmentRulesModal } from "./assignment-rules-modal"
import { ConvertLeadModal } from "../clientes/convert-lead-modal"
import { Plus, Search, Upload, Settings } from "lucide-react"
import { leadsQueries, clientesQueries, paquetesQueries, vendedoresQueries } from "@/lib/supabase/queries"
import type { Lead, Cliente, Paquete } from "@/types"

export function LeadsModule() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isRulesOpen, setIsRulesOpen] = useState(false)
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false)
  const [selectedLeadForConversion, setSelectedLeadForConversion] = useState<Lead | null>(null)
  const [selectedLeadHistory, setSelectedLeadHistory] = useState<string | null>(null)
  const [leadHistorial, setLeadHistorial] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [paquetesDisponibles, setPaquetesDisponibles] = useState<Paquete[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [vendedores, setVendedores] = useState<any[]>([])

  // Cargar todos los datos al montar
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [leadsData, clientesData, paquetesData, vendedoresData] = await Promise.all([
        leadsQueries.getAll(),
        clientesQueries.getAll(),
        paquetesQueries.getAll(),
        vendedoresQueries.getAll(),
      ])
      setLeads(leadsData)
      setClientes(clientesData)
      setPaquetesDisponibles(paquetesData)
      setVendedores(vendedoresData)
    } catch (err) {
      console.error("Error al cargar datos:", err)
      setError("No se pudieron cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const handleAddLead = async (data: any) => {
    try {
      const newLead = await leadsQueries.create(data)
      setLeads([...leads, newLead])
      setIsModalOpen(false)
    } catch (err) {
      console.error("Error al crear lead:", err)
      alert("No se pudo crear el lead")
    }
  }

  const handleImportLeads = async (importedLeads: any[]) => {
    try {
      const promises = importedLeads.map((lead) => leadsQueries.create(lead))
      const newLeads = await Promise.all(promises)
      setLeads([...leads, ...newLeads])
      setIsImportOpen(false)
    } catch (err) {
      console.error("Error al importar leads:", err)
      alert("No se pudieron importar los leads")
    }
  }

  const handleDeleteLead = async (id: string) => {
    try {
      await leadsQueries.delete(id)
      setLeads(leads.filter((l) => l.id !== id))
    } catch (err) {
      console.error("Error al eliminar lead:", err)
      alert("No se pudo eliminar el lead")
    }
  }

  const handleUpdateLead = async (id: string, updates: any) => {
    try {
      const updated = await leadsQueries.update(id, updates)
      setLeads(leads.map((l) => (l.id === id ? updated : l)))
    } catch (err) {
      console.error("Error al actualizar lead:", err)
      alert("No se pudo actualizar el lead")
    }
  }

  const handleViewHistory = async (leadId: string) => {
    try {
      const leadData = await leadsQueries.getById(leadId)
      setLeadHistorial(leadData.historial || [])
      setSelectedLeadHistory(leadId)
    } catch (err) {
      console.error("Error al cargar historial:", err)
      alert("No se pudo cargar el historial")
    }
  }

  const handleConvertToClient = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId)
    if (lead) {
      setSelectedLeadForConversion(lead)
      setIsConvertModalOpen(true)
    }
  }

  const handleConvertLead = async (leadId: string, clienteId: string) => {
    try {
      const lead = leads.find((l) => l.id === leadId)
      if (!lead) return

      // Convertir el lead en Supabase
      await leadsQueries.convertir(leadId, clienteId)

      // Actualizar el cliente con historial
      const cliente = clientes.find((c) => c.id === clienteId)
      if (cliente) {
        await clientesQueries.addHistorial(clienteId, `Lead convertido: ${lead.nombre} ${lead.apellido}`)
      }

      // Actualizar el estado local
      setLeads(leads.filter((l) => l.id !== leadId))

      // Cerrar el modal
      setIsConvertModalOpen(false)
      setSelectedLeadForConversion(null)
    } catch (err) {
      console.error("Error al convertir lead:", err)
      alert("No se pudo convertir el lead")
    }
  }

  const filteredLeads = leads.filter(
    (l) =>
      `${l.nombre} ${l.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.telefono && l.telefono.includes(searchTerm)),
  )

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Nuevo":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
      case "En gestión":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
      case "Cotizado":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
      case "Cerrado ganado":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
      case "Cerrado perdido":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Leads</h1>
          <p className="text-muted-foreground mt-1">
            Administra tu pipeline de ventas con seguimiento completo de leads turísticos
          </p>
        </div>
        <Card className="p-4 md:p-6">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando leads...</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Leads</h1>
          <p className="text-muted-foreground mt-1">
            Administra tu pipeline de ventas con seguimiento completo de leads turísticos
          </p>
        </div>
        <Card className="p-4 md:p-6">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchData} className="bg-orange-600 hover:bg-orange-700">
                Reintentar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestión de Leads</h1>
        <p className="text-muted-foreground mt-1">
          Administra tu pipeline de ventas con seguimiento completo de leads turísticos
        </p>
      </div>

      <Card className="p-4 md:p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre, email, teléfono..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white gap-2 flex-1 sm:flex-none"
              >
                <Plus className="w-4 h-4" />
                Lead
              </Button>
              <Button
                onClick={() => setIsImportOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white gap-2 flex-1 sm:flex-none"
              >
                <Upload className="w-4 h-4" />
                Importar
              </Button>
              <Button
                onClick={() => setIsRulesOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 flex-1 sm:flex-none"
              >
                <Settings className="w-4 h-4" />
                Reglas
              </Button>
            </div>
          </div>
        </div>

        <LeadsTable
          leads={filteredLeads}
          getEstadoColor={getEstadoColor}
          onDelete={handleDeleteLead}
          onUpdate={handleUpdateLead}
          onViewHistory={handleViewHistory}
          onConvertToClient={handleConvertToClient}
        />
      </Card>

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLead}
        paquetesDisponibles={paquetesDisponibles}
        vendedores={vendedores}
      />
      <ImportLeadsModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} onSubmit={handleImportLeads} />
      <AssignmentRulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <ConvertLeadModal
        isOpen={isConvertModalOpen}
        onClose={() => {
          setIsConvertModalOpen(false)
          setSelectedLeadForConversion(null)
        }}
        lead={selectedLeadForConversion || undefined}
        clientes={clientes}
        onConvert={handleConvertLead}
      />
      {selectedLeadHistory && (
        <LeadHistory
          leadId={selectedLeadHistory}
          history={leadHistorial}
          onClose={() => {
            setSelectedLeadHistory(null)
            setLeadHistorial([])
          }}
        />
      )}
    </div>
  )
}
