"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus } from "lucide-react"
import { PaquetesTable } from "./paquetes-table"
import { PaqueteModal } from "./paquete-modal"
import { paquetesQueries } from "@/lib/supabase/queries"
import type { Paquete } from "@/types"
import { toast } from "sonner"

export function PaquetesModule() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [paqueteToDelete, setPaqueteToDelete] = useState<string | null>(null)
  const [paquetes, setPaquetes] = useState<Paquete[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar paquetes al montar el componente
  useEffect(() => {
    fetchPaquetes()
  }, [])

  const fetchPaquetes = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await paquetesQueries.getAll()
      setPaquetes(data)
    } catch (err) {
      console.error("Error al cargar paquetes:", err)
      setError("No se pudieron cargar los paquetes")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingId) {
        // Actualizar paquete existente
        const updated = await paquetesQueries.update(editingId, data)
        setPaquetes(paquetes.map((p) => (p.id === updated.id ? updated : p)))
        setEditingId(null)
      } else {
        // Crear nuevo paquete
        const newPaquete = await paquetesQueries.create(data)
        setPaquetes([...paquetes, newPaquete])
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error("Error al guardar paquete:", err)
      toast.error("Error al guardar el paquete. Por favor, intenta de nuevo.")
    }
  }

  const handleEdit = (paquete: Paquete) => {
    setEditingId(paquete.id)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setPaqueteToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!paqueteToDelete) return

    try {
      await paquetesQueries.delete(paqueteToDelete)
      setPaquetes(paquetes.filter((p) => p.id !== paqueteToDelete))
      setPaqueteToDelete(null)
    } catch (err) {
      console.error("Error al eliminar paquete:", err)
      toast.error("Error al eliminar el paquete. Por favor, intenta de nuevo.")
    }
  }

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Paquetes Turísticos</h1>
            <p className="text-muted-foreground mt-1">Gestiona todos tus paquetes y ofertas</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Cargando paquetes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Paquetes Turísticos</h1>
            <p className="text-muted-foreground mt-1">Gestiona todos tus paquetes y ofertas</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchPaquetes}>Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Paquetes Turísticos</h1>
          <p className="text-muted-foreground mt-1">Gestiona todos tus paquetes y ofertas</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setIsModalOpen(true)
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Nuevo Paquete
        </Button>
      </div>

      {/* Table */}
      <PaquetesTable paquetes={paquetes} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Modal */}
      <PaqueteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingId(null)
        }}
        onSubmit={handleSubmit}
        editingPaquete={editingId ? paquetes.find((p) => p.id === editingId) || null : null}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Paquete"
        message="¿Estás seguro de que deseas eliminar este paquete? Esta acción no se puede deshacer."
      />
    </div>
  )
}
