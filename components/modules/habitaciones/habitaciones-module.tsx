"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import { HabitacionesTable } from "./habitaciones-table"
import { HabitacionModal } from "./habitacion-modal"

interface Habitacion {
  id: string
  nombre: string
  tipo_habitacion: string
  capacidad: number
  precio_por_noche: number
  descripcion: string
  activo: boolean
}

export function HabitacionesModule() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [filteredHabitaciones, setFilteredHabitaciones] = useState<Habitacion[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedHabitacion, setSelectedHabitacion] = useState<Habitacion | undefined>(undefined)

  useEffect(() => {
    fetchHabitaciones()
  }, [])

  useEffect(() => {
    filterHabitaciones()
  }, [searchTerm, habitaciones])

  const fetchHabitaciones = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("habitaciones")
        .select("*")
        .order("nombre", { ascending: true })

      if (error) throw error

      const mappedData = (data || []).map((item: any) => ({
        id: item.id,
        nombre: item.nombre,
        tipo_habitacion: item.tipo_habitacion || "",
        capacidad: item.capacidad || 0,
        precio_por_noche: item.precio_por_noche || 0,
        descripcion: item.descripcion || "",
        activo: item.activo ?? true,
      }))

      setHabitaciones(mappedData)
    } catch (error) {
      console.error("Error al cargar habitaciones:", error)
      toast.error("Error al cargar las habitaciones")
    } finally {
      setLoading(false)
    }
  }

  const filterHabitaciones = () => {
    if (!searchTerm.trim()) {
      setFilteredHabitaciones(habitaciones)
      return
    }

    const filtered = habitaciones.filter((habitacion) => {
      const search = searchTerm.toLowerCase()
      return (
        habitacion.nombre.toLowerCase().includes(search) ||
        habitacion.tipo_habitacion.toLowerCase().includes(search)
      )
    })

    setFilteredHabitaciones(filtered)
  }

  const handleCreate = () => {
    setSelectedHabitacion(undefined)
    setModalOpen(true)
  }

  const handleEdit = (habitacion: Habitacion) => {
    setSelectedHabitacion(habitacion)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta habitación?")) return

    try {
      const { error } = await supabase.from("habitaciones").delete().eq("id", id)

      if (error) throw error

      toast.success("Habitación eliminada exitosamente")
      fetchHabitaciones()
    } catch (error) {
      console.error("Error al eliminar habitación:", error)
      toast.error("Error al eliminar la habitación")
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (selectedHabitacion) {
        // Actualizar
        const { error } = await supabase
          .from("habitaciones")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedHabitacion.id)

        if (error) throw error
        toast.success("Habitación actualizada exitosamente")
      } else {
        // Crear
        const { error } = await supabase.from("habitaciones").insert(data)

        if (error) throw error
        toast.success("Habitación creada exitosamente")
      }

      setModalOpen(false)
      fetchHabitaciones()
    } catch (error) {
      console.error("Error al guardar habitación:", error)
      toast.error("Error al guardar la habitación")
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Habitaciones</h1>
          <p className="text-muted-foreground mt-1">Gestión de habitaciones de posadas</p>
        </div>
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Cargando habitaciones...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Habitaciones</h1>
          <p className="text-muted-foreground mt-1">Gestión de habitaciones de posadas</p>
        </div>
        <Button onClick={handleCreate} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Habitación
        </Button>
      </div>

      <Card className="p-4 md:p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <HabitacionesTable
          habitaciones={filteredHabitaciones}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <HabitacionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        habitacion={selectedHabitacion}
      />
    </div>
  )
}
