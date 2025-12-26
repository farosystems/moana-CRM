"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { ClientesTable } from "./clientes-table"
import { ClienteModal } from "./cliente-modal"
import { ImportClientesModal } from "./import-clientes-modal"
import { ClienteDetailModal } from "./cliente-detail-modal"
import { Plus, Search, Upload } from "lucide-react"
import { clientesQueries, vendedoresQueries } from "@/lib/supabase/queries"
import type { Cliente } from "@/types"
import { toast } from "sonner"

export function ClientesModule() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<string | null>(null)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [vendedores, setVendedores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClientes()
    fetchVendedores()
  }, [])

  const fetchVendedores = async () => {
    try {
      const data = await vendedoresQueries.getAll()
      setVendedores(data)
    } catch (err) {
      console.error("Error al cargar vendedores:", err)
    }
  }

  const fetchClientes = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await clientesQueries.getAll()
      setClientes(data)
    } catch (err) {
      console.error("Error al cargar clientes:", err)
      setError("No se pudieron cargar los clientes")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCliente = async (data: any) => {
    try {
      if (editingCliente) {
        // Actualizar cliente existente
        await clientesQueries.update(editingCliente.id, data)
        await fetchClientes()
        setEditingCliente(null)
      } else {
        // Crear nuevo cliente
        const newCliente = await clientesQueries.create(data)
        setClientes([...clientes, newCliente])
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error("Error al guardar cliente:", err)
      toast.error("Error al guardar el cliente. Por favor, intenta de nuevo.")
    }
  }

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCliente(null)
  }

  const handleImportClientes = async (importedClientes: any[]) => {
    try {
      const promises = importedClientes.map((cliente) => clientesQueries.create(cliente))
      const newClientes = await Promise.all(promises)
      setClientes([...clientes, ...newClientes])
      setIsImportOpen(false)
    } catch (err) {
      console.error("Error al importar clientes:", err)
      toast.error("Error al importar clientes. Por favor, intenta de nuevo.")
    }
  }

  const handleDeleteCliente = (id: string) => {
    setClienteToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!clienteToDelete) return

    try {
      await clientesQueries.delete(clienteToDelete)
      setClientes(clientes.filter((c) => c.id !== clienteToDelete))
      setClienteToDelete(null)
    } catch (err) {
      console.error("Error al eliminar cliente:", err)
      toast.error("Error al eliminar el cliente. Por favor, intenta de nuevo.")
    }
  }

  const handleViewDetail = (id: string) => {
    setSelectedClienteId(id)
    setIsDetailOpen(true)
  }

  const filteredClientes = clientes.filter((c) => c.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Administra tu base de clientes con conversión de leads e historial completo
          </p>
        </div>
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Cargando clientes...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Administra tu base de clientes con conversión de leads e historial completo
          </p>
        </div>
        <Card className="p-4 md:p-6">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchClientes}>Reintentar</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestión de Clientes</h1>
        <p className="text-muted-foreground mt-1">
          Administra tu base de clientes con conversión de leads e historial completo
        </p>
      </div>

      <Card className="p-4 md:p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white gap-2 flex-1 sm:flex-none"
              >
                <Plus className="w-4 h-4" />
                Cliente
              </Button>
              <Button
                onClick={() => setIsImportOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white gap-2 flex-1 sm:flex-none"
              >
                <Upload className="w-4 h-4" />
                Importar
              </Button>
            </div>
          </div>
        </div>

        <ClientesTable clientes={filteredClientes} onEdit={handleEditCliente} onDelete={handleDeleteCliente} onViewDetail={handleViewDetail} />
      </Card>

      <ClienteModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleAddCliente} cliente={editingCliente} vendedores={vendedores} />
      <ImportClientesModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSubmit={handleImportClientes}
      />
      {selectedClienteId && (
        <ClienteDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          cliente={clientes.find((c) => c.id === selectedClienteId)}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Cliente"
        message="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
      />
    </div>
  )
}
