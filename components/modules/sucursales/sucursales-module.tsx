"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { SucursalesTable } from "./sucursales-table"
import { SucursalModal } from "./sucursal-modal"
import { Plus, Search } from "lucide-react"
import { sucursalesQueries } from "@/lib/supabase/queries"
import type { Sucursal } from "@/types"

export function SucursalesModule() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sucursalToDelete, setSucursalToDelete] = useState<string | null>(null)
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [editingSucursal, setEditingSucursal] = useState<Sucursal | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSucursales()
  }, [])

  const fetchSucursales = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await sucursalesQueries.getAll()
      setSucursales(data)
    } catch (err) {
      console.error("Error al cargar sucursales:", err)
      setError("No se pudieron cargar las sucursales")
    } finally {
      setLoading(false)
    }
  }

  const handleAddSucursal = async (data: any) => {
    try {
      if (editingSucursal) {
        const updated = await sucursalesQueries.update(editingSucursal.id, data)
        setSucursales(sucursales.map((s) => (s.id === updated.id ? updated : s)))
      } else {
        const newSucursal = await sucursalesQueries.create(data)
        setSucursales([...sucursales, newSucursal])
      }
      setIsModalOpen(false)
      setEditingSucursal(null)
    } catch (err) {
      console.error("Error al guardar sucursal:", err)
      alert("No se pudo guardar la sucursal")
    }
  }

  const handleEditSucursal = (sucursal: Sucursal) => {
    setEditingSucursal(sucursal)
    setIsModalOpen(true)
  }

  const handleDeleteSucursal = (id: string) => {
    setSucursalToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!sucursalToDelete) return

    try {
      await sucursalesQueries.delete(sucursalToDelete)
      setSucursales(sucursales.filter((s) => s.id !== sucursalToDelete))
      setSucursalToDelete(null)
    } catch (err) {
      console.error("Error al eliminar sucursal:", err)
      alert("No se pudo eliminar la sucursal")
    }
  }

  const filteredSucursales = sucursales.filter(
    (s) =>
      s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.ciudad && s.ciudad.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sucursales / Áreas</h1>
          <p className="text-muted-foreground mt-1">Gestiona las sucursales y áreas de tu empresa</p>
        </div>
        <Card className="p-4 md:p-6">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando sucursales...</p>
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
          <h1 className="text-3xl font-bold text-foreground">Sucursales / Áreas</h1>
          <p className="text-muted-foreground mt-1">Gestiona las sucursales y áreas de tu empresa</p>
        </div>
        <Card className="p-4 md:p-6">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchSucursales} className="bg-indigo-600 hover:bg-indigo-700">
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
        <h1 className="text-3xl font-bold text-foreground">Sucursales / Áreas</h1>
        <p className="text-muted-foreground mt-1">Gestiona las sucursales y áreas de tu empresa</p>
      </div>

      <Card className="p-4 md:p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar sucursal..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setEditingSucursal(null)
                setIsModalOpen(true)
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Nueva Sucursal
            </Button>
          </div>
        </div>

        <SucursalesTable
          sucursales={filteredSucursales}
          onEdit={handleEditSucursal}
          onDelete={handleDeleteSucursal}
        />
      </Card>

      <SucursalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingSucursal(null)
        }}
        onSubmit={handleAddSucursal}
        sucursal={editingSucursal || undefined}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Sucursal"
        message="¿Estás seguro de que deseas eliminar esta sucursal? Esta acción no se puede deshacer."
      />
    </div>
  )
}
