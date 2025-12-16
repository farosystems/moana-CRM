"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { VendedoresTable } from "./vendedores-table"
import { VendedorModal } from "./vendedor-modal"
import { Plus, Search } from "lucide-react"
import { vendedoresQueries, sucursalesQueries } from "@/lib/supabase/queries"
import type { Vendedor, Sucursal } from "@/types"

export function VendedoresModule() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [vendedorToDelete, setVendedorToDelete] = useState<string | null>(null)
  const [editingVendedor, setEditingVendedor] = useState<Vendedor | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [vendedores, setVendedores] = useState<Vendedor[]>([])
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar vendedores y sucursales al montar el componente
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [vendedoresData, sucursalesData] = await Promise.all([
        vendedoresQueries.getAll(),
        sucursalesQueries.getAll(),
      ])
      setVendedores(vendedoresData)
      setSucursales(sucursalesData)
    } catch (err) {
      console.error("Error al cargar datos:", err)
      setError("No se pudieron cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const handleAddVendedor = async (data: any) => {
    try {
      if (editingVendedor) {
        // Actualizar vendedor existente
        await vendedoresQueries.update(editingVendedor.id, data)
        setEditingVendedor(null)
      } else {
        // Crear nuevo vendedor
        await vendedoresQueries.create(data)
      }

      // Recargar todos los vendedores para obtener el JOIN con sucursales
      await fetchData()
      setIsModalOpen(false)
    } catch (err) {
      console.error("Error al guardar vendedor:", err)
      alert("Error al guardar el vendedor. Por favor, intenta de nuevo.")
    }
  }

  const handleDeleteVendedor = (id: string) => {
    setVendedorToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!vendedorToDelete) return

    try {
      await vendedoresQueries.delete(vendedorToDelete)
      setVendedores(vendedores.filter((v) => v.id !== vendedorToDelete))
      setVendedorToDelete(null)
    } catch (err) {
      console.error("Error al eliminar vendedor:", err)
      alert("Error al eliminar el vendedor. Por favor, intenta de nuevo.")
    }
  }

  const handleEditVendedor = (vendedor: Vendedor) => {
    setEditingVendedor(vendedor)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingVendedor(null)
  }

  const filteredVendedores = vendedores.filter(
    (v) =>
      v.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.sucursal && v.sucursal.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendedores</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu equipo de ventas</p>
        </div>
        <Card className="p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Cargando vendedores...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendedores</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu equipo de ventas</p>
        </div>
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchData}>Reintentar</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Vendedores</h1>
        <p className="text-muted-foreground mt-1">Gestiona tu equipo de ventas</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar vendedor..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setEditingVendedor(null)
              setIsModalOpen(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full md:w-auto"
          >
            <Plus className="w-4 h-4" />
            Nuevo Vendedor
          </Button>
        </div>

        <VendedoresTable vendedores={filteredVendedores} onEdit={handleEditVendedor} onDelete={handleDeleteVendedor} />
      </Card>

      <VendedorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddVendedor}
        vendedor={editingVendedor}
        sucursales={sucursales}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Vendedor"
        message="¿Estás seguro de que deseas eliminar este vendedor? Esta acción no se puede deshacer."
      />
    </div>
  )
}
