"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import { PosadasTable } from "./posadas-table"
import { PosadaModal } from "./posada-modal"

interface Posada {
  id: string
  nombre: string
  ubicacion: string
  estrellas: number
  telefono: string
  email: string
  precio_referencia: number
  activo: boolean
  notas: string
}

export function PosadasModule() {
  const [posadas, setPosadas] = useState<Posada[]>([])
  const [filteredPosadas, setFilteredPosadas] = useState<Posada[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPosada, setSelectedPosada] = useState<Posada | undefined>(undefined)

  useEffect(() => {
    fetchPosadas()
  }, [])

  useEffect(() => {
    filterPosadas()
  }, [searchTerm, posadas])

  const fetchPosadas = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("posadas")
        .select("*")
        .order("nombre", { ascending: true })

      if (error) throw error

      const mappedData = (data || []).map((item: any) => ({
        id: item.id,
        nombre: item.nombre,
        ubicacion: item.ubicacion || "",
        estrellas: item.estrellas || 0,
        telefono: item.telefono || "",
        email: item.email || "",
        precio_referencia: item.precio_referencia || 0,
        activo: item.activo ?? true,
        notas: item.notas || "",
      }))

      setPosadas(mappedData)
    } catch (error) {
      console.error("Error al cargar posadas:", error)
      toast.error("Error al cargar las posadas")
    } finally {
      setLoading(false)
    }
  }

  const filterPosadas = () => {
    if (!searchTerm.trim()) {
      setFilteredPosadas(posadas)
      return
    }

    const filtered = posadas.filter((posada) => {
      const search = searchTerm.toLowerCase()
      return (
        posada.nombre.toLowerCase().includes(search) ||
        posada.ubicacion.toLowerCase().includes(search)
      )
    })

    setFilteredPosadas(filtered)
  }

  const handleCreate = () => {
    setSelectedPosada(undefined)
    setModalOpen(true)
  }

  const handleEdit = (posada: Posada) => {
    setSelectedPosada(posada)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta posada?")) return

    try {
      const { error } = await supabase.from("posadas").delete().eq("id", id)

      if (error) throw error

      toast.success("Posada eliminada exitosamente")
      fetchPosadas()
    } catch (error) {
      console.error("Error al eliminar posada:", error)
      toast.error("Error al eliminar la posada")
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (selectedPosada) {
        // Actualizar
        const { error } = await supabase
          .from("posadas")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedPosada.id)

        if (error) throw error
        toast.success("Posada actualizada exitosamente")
      } else {
        // Crear
        const { error } = await supabase.from("posadas").insert(data)

        if (error) throw error
        toast.success("Posada creada exitosamente")
      }

      setModalOpen(false)
      fetchPosadas()
    } catch (error) {
      console.error("Error al guardar posada:", error)
      toast.error("Error al guardar la posada")
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Posadas</h1>
          <p className="text-muted-foreground mt-1">Gestión de posadas y alojamientos</p>
        </div>
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Cargando posadas...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Posadas</h1>
          <p className="text-muted-foreground mt-1">Gestión de posadas y alojamientos</p>
        </div>
        <Button onClick={handleCreate} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Posada
        </Button>
      </div>

      <Card className="p-4 md:p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <PosadasTable
          posadas={filteredPosadas}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <PosadaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        posada={selectedPosada}
      />
    </div>
  )
}
